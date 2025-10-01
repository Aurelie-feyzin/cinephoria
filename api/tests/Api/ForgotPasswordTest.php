<?php
declare(strict_types=1);

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\PasswordToken;
use App\Entity\User;
use App\Service\Mailer;
use App\Tests\DataFixtures\UserTestFixtures;
use App\Tests\Utils\TestFixtureLoaderTrait;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ForgotPasswordTest extends ApiTestCase
{
    use TestFixtureLoaderTrait;

    private const URL_FORGOT_PASSWORD = 'http://cinephoria.dvp/forgot-password/';
    private ?Client $client;
    private ?EntityManagerInterface $entityManager;

    private Mailer $mailer;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        $this->mailer = $this->createMock(Mailer::class);
        static::getContainer()->set(Mailer::class, $this->mailer);

        $this->entityManager = self::getContainer()
            ->get('doctrine')
            ->getManager();
        $container = self::getContainer();

        $this->loadFixtures($this->entityManager, [
            new UserTestFixtures(),
        ], $container);
    }

    public function testFetchForgotPassword(): void
    {
        $this->client->request('POST', self::URL_FORGOT_PASSWORD, ['json' => [
            'email' => 'user@test.com']]);

        self::assertResponseIsSuccessful();
        $tokenRepo = static::getContainer()->get('doctrine')->getRepository(PasswordToken::class);
        $tokens = $tokenRepo->findAll();
        self::assertCount(1, $tokens);
        self::assertSame('user@test.com', $tokens[0]->getUser()->getEmail());
    }

    public function testResetPassword(): void
    {
        $userRepo = $this->entityManager->getRepository(User::class);

        $user = $userRepo->findOneBy(['email' => 'user@test.com']);
        $token = new PasswordToken();
        $token->setUser($user);
        $token->setToken('test-token');
        $token->setExpiresAt(new DateTime('+1 day'));
        $this->entityManager->persist($token);
        $this->entityManager->flush();

        $this->client->request('POST', self::URL_FORGOT_PASSWORD.'test-token', [
            'json' => ['password' => 'NewP@ssword1'],
        ]);

        self::assertResponseIsSuccessful();

        $this->entityManager->refresh($user);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        self::assertTrue($passwordHasher->isPasswordValid($user, 'NewP@ssword1'));
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        // doing this is recommended to avoid memory leaks
        $this->entityManager->close();
        $this->entityManager = null;
    }
}
