<?php
declare(strict_types=1);

namespace App\Tests\Controller;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\API\TheMovieDB\TmdbApiService;
use App\Tests\DataFixtures\UserTestFixtures;
use App\Tests\Utils\TestFixtureLoaderTrait;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class TmdbControllerSecurityTest extends ApiTestCase
{
    use TestFixtureLoaderTrait;

    private Client $client;

    private EntityManagerInterface $entityManager;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient([], [
            'base_uri' => 'http://cinephoria.dvp',
        ]);

        $this->entityManager = $this->client->getContainer()
            ->get('doctrine')
            ->getManager();

        $container = self::getContainer();

        $this->loadFixtures($this->entityManager, [
            new UserTestFixtures(),
        ], $container);
    }

    /**
     * @param string[] $roles
     *
     * @throws ClientExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     *
     * @dataProvider accessProvider
     */
    public function testAccessControl(?array $roles, int $expectedStatus): void
    {
        $token = null;
        if (null !== $roles) {
            $userRepository = $this->entityManager->getRepository(User::class);
            assert($userRepository instanceof UserRepository);
            $users = $userRepository->findByRole($roles[0]);
            $user = $users[0];
            $this->client->loginUser($users[0]);
            $jwtManager = $this->client->getContainer()->get(JWTTokenManagerInterface::class);
            $token = $jwtManager->create($user);
        }

        // Mock TMDB service
        $tmdbServiceMock = $this->createMock(TmdbApiService::class);
        $tmdbServiceMock->method('searchMovies')
            ->willReturn([
                'results' => [
                    ['id' => 1, 'title' => 'Inception'],
                ],
            ]);

        static::getContainer()->set(TmdbApiService::class, $tmdbServiceMock);

        $response = $this->client->request(
            'POST',
            '/movies/tmdb/search', [
                'headers' => [
                    'Content-Type' => 'application/ld+json',
                    'Authorization' => 'Bearer '.$token,
                ],
                'json' => ['title' => 'Inception'],
            ]
        );

        self::assertResponseStatusCodeSame($expectedStatus);
        if (Response::HTTP_OK === $expectedStatus) {
            $this->assertSame([['id' => 1, 'title' => 'Inception']], json_decode($response->getContent(), true));
        }
    }

    /**
     * Data provider pour différents scénarios de rôle.
     *
     * @return array<string, array{0: ?array<string>, 1: int}>
     */
    public static function accessProvider(): array
    {
        return [
            'anonymous user' => [null, Response::HTTP_UNAUTHORIZED],
            'user with ROLE_USER' => [['ROLE_USER'], Response::HTTP_FORBIDDEN],
            'employee with ROLE_EMPLOYEE' => [['ROLE_EMPLOYEE'], Response::HTTP_OK],
            'employee with ROLE_ADMIN' => [['ROLE_ADMIN'], Response::HTTP_OK],
        ];
    }
}
