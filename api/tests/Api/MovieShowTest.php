<?php
declare(strict_types=1);

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\Movie;
use App\Entity\MovieTheater;
use App\Tests\DataFixtures\CinemaTestFixtures;
use App\Tests\DataFixtures\MovieTestFixtures;
use App\Tests\DataFixtures\MovieTheatherTestFixtures;
use App\Tests\DataFixtures\UserTestFixtures;
use App\Tests\Utils\TestFixtureLoaderTrait;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

class MovieShowTest extends ApiTestCase
{
    use TestFixtureLoaderTrait;

    private const MOVIE_SHOW_API_PATH = 'http://cinephoria.dvp/api/movie_shows';

    private ?EntityManagerInterface $entityManager;
    private ?Client $client;
    private ?Movie $movie;
    private ?MovieTheater $theater;

    private ?string $token = null;

    protected function setUp(): void
    {
        $client = static::createClient();

        $this->client = $client;

        $this->entityManager = self::getContainer()
            ->get('doctrine')
            ->getManager();
        $container = self::getContainer();

        $this->loadFixtures($this->entityManager, [
            new UserTestFixtures(),
            new CinemaTestFixtures(),
            new MovieTestFixtures(),
            new MovieTheatherTestFixtures(),
        ], $container);

        $this->movie = $this->executor->getReferenceRepository()->getReference('movie', Movie::class);
        $this->theater = $this->executor->getReferenceRepository()->getReference('theater', MovieTheater::class);
    }

    protected function createClientWithCredentials(?string $token = null): Client
    {
        $token = $token ?: $this->getToken();

        return static::createClient([], ['headers' => ['authorization' => 'Bearer '.$token]]);
    }

    /**
     * Use other credentials if needed.
     *
     * @param string[] $body
     */
    protected function getToken(array $body = []): string
    {
        if ($this->token) {
            return $this->token;
        }

        $response = $this->client->request('POST', 'http://cinephoria.dvp/api/auth', ['json' => $body ?: [
            'username' => 'employee@test.com',
            'password' => 'P@ssword1',
        ]]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->token = $data['token'];

        return $data['token'];
    }

    public function testPostMovieShowWithValidData(): void
    {
        $this->client->request('POST', self::MOVIE_SHOW_API_PATH, [
            'json' => [
                'movie' => MovieTestFixtures::MOVIE_API_PATH.$this->movie->getId(),
                'movieTheater' => MovieTheatherTestFixtures::MOVIE_THEATHER_API_PATH.$this->theater->getId(),
                'date' => (new DateTimeImmutable('+1 day'))->format('Y-m-d'),
                'startTime' => '18:00',
                'endTime' => '20:00',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
                'Authorization' => 'Bearer '.$this->getToken(),
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertJsonContains(['startTime' => '18:00']);
    }

    public function testUserCannotCreateMovieShow(): void
    {
        $this->client->request('POST', self::MOVIE_SHOW_API_PATH, [
            'json' => [
                'movie' => MovieTestFixtures::MOVIE_API_PATH.$this->movie->getId(),
                'movieTheater' => MovieTheatherTestFixtures::MOVIE_THEATHER_API_PATH.$this->theater->getId(),
                'date' => (new DateTimeImmutable('+1 day'))->format('Y-m-d'),
                'startTime' => '18:00',
                'endTime' => '20:00',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
                'Authorization' => 'Bearer '.$this->getToken([
                    'username' => 'user@test.com',
                    'password' => 'P@ssword1',
                ]),
            ],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    /**
     * @dataProvider provideInvalidShowTimes
     */
    public function testPostMovieShowInvalidTime(string $startTime, string $endTime, ?int $duration): void
    {
        $this->movie->setDuration($duration);
        $this->entityManager->flush();

        $this->client->request('POST', self::MOVIE_SHOW_API_PATH, [
            'json' => [
                'movie' => MovieTestFixtures::MOVIE_API_PATH.$this->movie->getId(),
                'movieTheater' => MovieTheatherTestFixtures::MOVIE_THEATHER_API_PATH.$this->theater->getId(),
                'date' => (new DateTimeImmutable('tomorrow'))->format('Y-m-d'),
                'startTime' => $startTime,
                'endTime' => $endTime,
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
                'Authorization' => 'Bearer '.$this->getToken(),
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertJsonContains(['violations' => []]);
    }

    /**
     * @return iterable<array{string, string, int|null}>
     */
    public function provideInvalidShowTimes(): iterable
    {
        yield 'endTime < expected end' => ['18:00', '18:30', 90]; // 30min alors qu'on veut 90
        yield 'duration null' => ['18:00', '20:00', null];
        yield 'startTime malformed' => ['bad', '20:00', 90];
        yield 'endTime malformed' => ['18:00', 'wrong', 90];
    }
}
