<?php
declare(strict_types=1);

namespace App\Tests\EventSubscriber;

use App\Entity\PasswordToken;
use App\Entity\User;
use App\EventSubscriber\ForgotPasswordEventSubscriber;
use App\Repository\UserRepository;
use App\Service\Mailer;
use CoopTilleuls\ForgotPasswordBundle\Event\CreateTokenEvent;
use CoopTilleuls\ForgotPasswordBundle\Event\UpdatePasswordEvent;
use CoopTilleuls\ForgotPasswordBundle\Event\UserNotFoundEvent;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class ForgotPasswordEventSubscriberTest extends TestCase
{
    private ForgotPasswordEventSubscriber $subscriber;
    private Mailer&MockObject $mailer;
    private UserRepository&MockObject $userRepository;
    private Security&MockObject $security;
    private UserPasswordHasherInterface&MockObject $passwordHasher;

    public function testGetSubscribedEvents(): void
    {
        $expected = [
            KernelEvents::REQUEST => 'onKernelRequest',
            UserNotFoundEvent::class => 'onUserNotFound',
            CreateTokenEvent::class => 'onCreateToken',
            UpdatePasswordEvent::class => 'onUpdatePassword',
        ];

        $this->assertSame($expected, ForgotPasswordEventSubscriber::getSubscribedEvents());
    }

    protected function setUp(): void
    {
        $this->mailer = $this->createMock(Mailer::class);
        $validator = new DummyValidator();
        $this->userRepository = $this->createMock(UserRepository::class);
        $this->security = $this->createMock(Security::class);
        $this->passwordHasher = $this->createMock(UserPasswordHasherInterface::class);

        $this->subscriber = new ForgotPasswordEventSubscriber(
            $this->mailer,
            $validator,
            $this->userRepository,
            $this->security,
            $this->passwordHasher
        );
    }

    public function testOnKernelRequestThrowsIfUserAuthenticated(): void
    {
        $user = new User();

        $token = $this->createMock(TokenInterface::class);
        $token->method('getUser')->willReturn($user);

        $this->security->method('getToken')->willReturn($token);

        $request = new Request([], [], ['_route' => 'coop_tilleuls_forgot_password_request']);
        $event = new RequestEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST);

        $this->expectException(AccessDeniedHttpException::class);
        $this->subscriber->onKernelRequest($event);
    }

    public function testOnKernelRequestDoesNothingIfNoUser(): void
    {
        $this->security->method('getToken')->willReturn(null);

        $request = new Request([], [], ['_route' => 'coop_tilleuls_forgot_password_request']);
        $event = new RequestEvent($this->createMock(HttpKernelInterface::class), $request, HttpKernelInterface::MAIN_REQUEST);

        // Should not throw
        $this->subscriber->onKernelRequest($event);
        $this->addToAssertionCount(1);
    }

    public function testOnCreateTokenSendsEmail(): void
    {
        $user = new User();
        $user->setEmail('test@test.com');

        $passwordToken = $this->createMock(PasswordToken::class);
        $passwordToken->method('getUser')->willReturn($user);
        $passwordToken->method('getToken')->willReturn('abc123');

        $event = new CreateTokenEvent($passwordToken);

        $this->mailer->expects($this->once())
            ->method('sendForgotPassword')
            ->with($user, 'abc123');

        $this->subscriber->onCreateToken($event);
    }

    public function testOnUpdatePasswordHashesAndSaves(): void
    {
        $user = new User();
        $passwordToken = new PasswordToken();
        $passwordToken->setUser($user);

        $event = new UpdatePasswordEvent($passwordToken, 'newPassword123');

        // $this->validator->expects($this->once())->method('validate')->with($user);
        $this->passwordHasher->expects($this->once())
            ->method('hashPassword')
            ->with($user, 'newPassword123')
            ->willReturn('hashedPassword');

        $this->userRepository->expects($this->once())
            ->method('upgradePassword')
            ->with($user, 'hashedPassword');

        $this->subscriber->onUpdatePassword($event);
    }

    public function testOnUserNotFoundDoesNothing(): void
    {
        $event = new UserNotFoundEvent();
        $this->subscriber->onUserNotFound($event);

        $this->assertTrue(true); // just ensure no exception
    }
}
