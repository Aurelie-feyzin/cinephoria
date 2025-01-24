<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractTsvImport;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Generator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends AbstractTsvImport
{
    private const FILENAME = 'user.tsv';

    public function __construct(string $rootDirectory, private readonly UserPasswordHasherInterface $userPasswordHasher)
    {
        parent::__construct($rootDirectory);
    }

    public function getTsvFilename(): string
    {
        return self::FILENAME;
    }

    public function skipEmptyLine(): bool
    {
        return false;
    }

    public function insertItem(EntityManagerInterface $manager, Generator $faker, array $element): bool
    {
        $user = (new User())
            ->setFirstName($element[0])
            ->setLastName($element[1])
            ->setEmail($element[2])
            ->setRoles([$element[4]]);
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $element[3]));

        $this->addReference('user_'.$element[2], $user);
        $manager->persist($user);

        return true;
    }
}