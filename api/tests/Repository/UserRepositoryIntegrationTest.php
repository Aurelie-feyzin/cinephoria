<?php
declare(strict_types=1);

namespace App\Tests\Repository;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\DataFixtures\UserTestFixtures;
use App\Tests\Utils\TestFixtureLoaderTrait;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class UserRepositoryIntegrationTest extends KernelTestCase
{
    use TestFixtureLoaderTrait;

    private UserRepository $repository;
    private EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $kernel = self::bootKernel();

        $this->entityManager = $kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->repository = self::getContainer()->get(UserRepository::class);

        $container = self::getContainer();

        $this->loadFixtures($this->entityManager, [
            new UserTestFixtures(),
        ], $container);
    }

    public function testFindByRoleReturnsResults(): void
    {
        $users = $this->repository->findByRole('ROLE_USER');

        $this->assertCount(1, $users);
        $this->assertInstanceOf(User::class, $users[0]);
        $this->assertContains('ROLE_USER', $users[0]->getRoles());
    }

    public function testFindByRoleReturnsEmptyIfNoMatch(): void
    {
        $users = $this->repository->findByRole('ROLE_NON_EXISTENT');

        $this->assertEmpty($users);
    }
}
