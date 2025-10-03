<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Service\Mailer;
use App\State\UserHashPasswordStateProcessor;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserHashPasswordStateProcessorTest extends TestCase
{
    private UserPasswordHasherInterface&MockObject $hasher;
    private Mailer&MockObject $mailer;
    private Security&MockObject $security;

    /**
     * @var ProcessorInterface<object, object|null>&MockObject
     */
    private ProcessorInterface&MockObject $innerProcessor;
    private UserHashPasswordStateProcessor $processor;
    private Operation $operation;

    protected function setUp(): void
    {
        $this->hasher = $this->createMock(UserPasswordHasherInterface::class);
        $this->mailer = $this->createMock(Mailer::class);
        $this->security = $this->createMock(Security::class);
        $this->innerProcessor = $this->createMock(ProcessorInterface::class);

        $this->processor = new UserHashPasswordStateProcessor(
            $this->innerProcessor,
            $this->hasher,
            $this->security,
            $this->mailer,
        );

        $this->operation = $this->createMock(Operation::class);
    }

    public function testProcessHashesPasswordWhenPlainPasswordIsSet(): void
    {
        $user = (new User())->setPlainPassword('secret');

        $this->hasher->expects(self::once())
            ->method('hashPassword')
            ->with($user, 'secret')
            ->willReturn('hashed-secret');

        $this->innerProcessor->expects(self::once())
            ->method('process');

        $this->security->method('isGranted')->willReturn(false);

        $this->mailer->expects(self::once())
            ->method('sendWelcomeEmail')
            ->with($user);

        $this->processor->process($user, $this->operation);
        self::assertSame('hashed-secret', $user->getPassword());
    }

    public function testProcessSendsWelcomeEmployeeEmailWhenAdminCreatesEmployee(): void
    {
        $user = (new User())->setRoles(['ROLE_EMPLOYEE']);

        $this->hasher->expects(self::never())->method('hashPassword');

        $this->innerProcessor->expects(self::once())->method('process');

        $this->security->method('isGranted')->with('ROLE_ADMIN')->willReturn(true);

        $this->mailer->expects(self::once())
            ->method('sendWelcomeEmployeeEmail')
            ->with($user);

        $result = $this->processor->process($user, $this->operation);
        self::assertSame($user, $result);
    }

    public function testProcessSendsWelcomeEmailByDefaultAndReturnsNull(): void
    {
        $user = (new User())->setRoles(['ROLE_USER']);

        $this->innerProcessor->expects(self::once())->method('process');

        $this->security->method('isGranted')->willReturn(false);

        $this->mailer->expects(self::once())
            ->method('sendWelcomeEmail')
            ->with($user);

        $result = $this->processor->process($user, $this->operation);
        self::assertNull($result);
    }
}
