<?php
declare(strict_types=1);

namespace App\Tests\Controller;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;
use App\Service\FixtureRunner;
use Symfony\Component\HttpFoundation\Response;

class ApiFixtureControllerTest extends ApiTestCase
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
     * @param array{0: int, 1: int|null} $exitCodes
     *
     * @dataProvider fixtureProvider
     */
    public function testRunFixtures(array $exitCodes, int $expectedStatus, string $expectedMessage): void
    {
        // Mock Application pour simuler les codes de retour
        $runnerMock = $this->createMock(FixtureRunner::class);
        $runnerMock->method('run')->willReturnOnConsecutiveCalls(...$exitCodes);

        static::getContainer()->set(FixtureRunner::class, $runnerMock);

        // Authentifier un admin
        $this->client->loginUser($this->createAdminUser());
        $this->client->request('POST', '/api/complete-fixtures');

        self::assertResponseStatusCodeSame($expectedStatus);
        self::assertJsonContains(['status' => $expectedMessage]);
    }

    /**
     * @return array<string, array{'exitCodes': array{0: int, 1: int|null}, 'expectedStatus': int, 'expectedMessage': string}>
     */
    public function fixtureProvider(): array
    {
        return [
            'success' => [
                'exitCodes' => [0, 0],
                'expectedStatus' => Response::HTTP_OK,
                'expectedMessage' => 'Terminé',
            ],
            'postgres fails' => [
                'exitCodes' => [1],
                'expectedStatus' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'expectedMessage' => 'error',
            ],
            'mongo fails' => [
                'exitCodes' => [0, 1],
                'expectedStatus' => Response::HTTP_INTERNAL_SERVER_ERROR,
                'expectedMessage' => 'Erreur',
            ],
        ];
    }

    private function createAdminUser(): User
    {
        $user = new User();
        $user->setEmail('admin@test.com');
        $user->setPassword('password');
        $user->setRoles(['ROLE_ADMIN']);

        return $user;
    }
}
