<?php
declare(strict_types=1);

namespace App\Tests\Controller;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ApiProfileControllerTest extends ApiTestCase
{
    private Client $client;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient([], [
            'base_uri' => 'http://cinephoria.dvp',
        ]);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function testProfileWithoutAuthentication(): void
    {
        $this->client->request('GET', 'http://cinephoria.dvp/api/profile');
        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        self::assertJsonContains(['message' => 'missing credentials']);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     *
     * @dataProvider userProvider
     */
    public function testProfileWithAuthenticatedUser(User $user, ?string $role): void
    {
        $this->client->loginUser($user);

        $this->client->request('GET', '/api/profile');
        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'email' => 'john.doe@email.fr',
            'firstName' => 'John',
            'lastName' => 'Doe',
            'role' => $role,
        ]);
    }

    /**
     * @return array<string, array{0: User, 1: ?string}>
     */
    public function userProvider(): array
    {
        $user = (new User())
            ->setFirstName('John')
            ->setLastName('Doe')
            ->setEmail('john.doe@email.fr');

        $employee = clone $user;
        $employee->setRoles(['ROLE_EMPLOYEE']);
        $admin = clone $user;
        $admin->setRoles(['ROLE_ADMIN']);

        return [
            'simple user' => [$user, null],
            'employee user' => [$employee, 'employee'],
            'admin user' => [$admin, 'admin'],
        ];
    }
}
