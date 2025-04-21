<?php
declare(strict_types=1);

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserTest extends ApiTestCase
{
    private const URL_USERS = 'http://cinephoria.dvp/api/users';
    private ?EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    public function testCreateUser(): void
    {
        $validEmail = 'testCreateUser@test.com';
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $validEmail]);
        if ($existingUser) {
            $this->entityManager->remove($existingUser);
            $this->entityManager->flush();
        }

        static::createClient()->request('POST', self::URL_USERS, [
            'json' => [
                'firstName' => 'firstName',
                'lastName' => 'lastName',
                'email' => $validEmail,
                'plainPassword' => 'P@ssword1',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $validEmail]);
        $this->assertNotNull($user);
    }

    public function testDuplicateEmail(): void
    {
        static::createClient()->request('POST', self::URL_USERS, [
            'json' => [
                'firstName' => 'firstName',
                'lastName' => 'lastName',
                'email' => 'testCreateUser@test.com',
                'plainPassword' => 'P@ssword1',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testNotValidEmail(): void
    {
        static::createClient()->request('POST', self::URL_USERS, [
            'json' => [
                'firstName' => 'firstName',
                'lastName' => 'lastName',
                'email' => 'invalid-email',
                'plainPassword' => 'P@ssword1',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testCreateUserWithWeakPassword(): void
    {
        $client = static::createClient();

        $client->request('POST', self::URL_USERS, [
            'json' => [
                'firstName' => 'Weak',
                'lastName' => 'Password',
                'email' => 'weakpass@test.com',
                'plainPassword' => 'weak',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        // doing this is recommended to avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}
