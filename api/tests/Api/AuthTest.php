<?php
declare(strict_types=1);

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Tests\DataFixtures\UserTestFixtures;
use App\Tests\Utils\TestFixtureLoaderTrait;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class AuthTest extends ApiTestCase
{
    use TestFixtureLoaderTrait;

    private const URL_AUTH = 'http://cinephoria.dvp/api/auth';

    private ?Client $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        $entityManager = self::getContainer()
            ->get('doctrine')
            ->getManager();

        $container = self::getContainer();

        $this->loadFixtures($entityManager, [
            new UserTestFixtures(),
        ], $container);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function testValidUserAuth(): void
    {
        $response = $this->client->request('POST', self::URL_AUTH, ['json' => [
            'username' => 'user@test.com',
            'password' => 'P@ssword1',
        ]]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertArrayHasKey('token', $data);
    }

    /**
     * @dataProvider invalidAuthProvider
     *
     * @throws TransportExceptionInterface
     */
    public function testInvalidAuth(string $username, string $password): void
    {
        $this->client->request('POST', self::URL_AUTH, ['json' => [
            'username' => $username,
            'password' => $password,
        ]]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public function invalidAuthProvider(): array
    {
        return [
            'invalid password' => ['user@test.com', 'Inv@lid1'],
            'invalid username' => ['invalide@test.com', 'P@ssword1'],
        ];
    }
}
