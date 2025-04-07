<?php
declare(strict_types=1);

namespace App\Tests\Utils;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

trait TestFixtureLoaderTrait
{
    private ORMExecutor $executor;

    /**
     * @param Fixture[] $fixtures
     */
    protected function loadFixtures(EntityManagerInterface $em, array $fixtures, ContainerInterface $container): void
    {
        $loader = new Loader();

        foreach ($fixtures as $fixture) {
            // Auto-inject password hasher if the fixture has the setter
            if (method_exists($fixture, 'setPasswordHasher')) {
                $fixture->setPasswordHasher($container->get(UserPasswordHasherInterface::class));
            }

            $loader->addFixture($fixture);
        }

        $purger = new ORMPurger($em);
        $this->executor = new ORMExecutor($em, $purger);
        $this->executor->purge();
        $this->executor->execute($loader->getFixtures());
    }
}
