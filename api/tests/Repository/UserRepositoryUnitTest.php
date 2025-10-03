<?php
declare(strict_types=1);

namespace App\Tests\Repository;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class UserRepositoryUnitTest extends TestCase
{
    private EntityManagerInterface&MockObject $entityManager;
    private UserRepository $userRepository;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);

        $this->userRepository = $this->getMockBuilder(UserRepository::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getEntityManager'])
            ->getMock();

        $this->userRepository->method('getEntityManager')->willReturn($this->entityManager);
    }

    public function testSaveCallsPersist(): void
    {
        $user = new User();

        $this->entityManager->expects($this->once())
            ->method('persist')
            ->with($user);

        $this->userRepository->save($user);
    }

    public function testRemoveCallsRemove(): void
    {
        $user = new User();

        $this->entityManager->expects($this->once())
            ->method('remove')
            ->with($user);

        $this->userRepository->remove($user);
    }

    public function testUpgradePasswordWorks(): void
    {
        $user = $this->createMock(User::class);
        $user->expects($this->once())->method('setPassword')->with('newHash');

        $this->entityManager->expects($this->once())->method('persist')->with($user);
        $this->entityManager->expects($this->once())->method('flush');

        $this->userRepository->upgradePassword($user, 'newHash');
    }

    public function testUpgradePasswordThrowsOnWrongUser(): void
    {
        $this->expectException(UnsupportedUserException::class);

        $wrongUser = $this->createMock(PasswordAuthenticatedUserInterface::class);

        $this->userRepository->upgradePassword($wrongUser, 'hash');
    }
}
