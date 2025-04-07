<?php
declare(strict_types=1);

namespace App\Tests\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserTestFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function setPasswordHasher(UserPasswordHasherInterface $hasher): void
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $users = [
            ['user', 'User', 'user@test.com', 'ROLE_USER'],
            ['employee', 'Employee', 'employee@test.com', 'ROLE_EMPLOYEE'],
            ['admin', 'admin', 'admin@test.com', 'ROLE_ADMIN'],
        ];

        foreach ($users as $arrayUser) {
            $user = (new User())
                ->setFirstName($arrayUser[0])
                ->setLastName($arrayUser[1])
                ->setEmail($arrayUser[2])
                ->setRoles([$arrayUser[3]]);
            $hashedPassword = $this->hasher->hashPassword($user, 'P@ssword1');
            $user->setPassword($hashedPassword);
            $manager->persist($user);
        }

        $manager->flush();
    }
}
