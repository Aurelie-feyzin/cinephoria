<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractTsvImport;
use App\Entity\Address;
use App\Entity\Cinema;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Generator;

class CinemaFixtures extends AbstractTsvImport
{
    private const FILENAME = 'cinemas.tsv';

    public function getTsvFilename(): string
    {
        return self::FILENAME;
    }

    public function skipEmptyLine(): bool
    {
        return false;
    }

    /**
     * @param mixed[] $element
     */
    public function insertItem(EntityManagerInterface $manager, Generator $faker, array $element): bool
    {
        $address = (new Address())
            ->setStreet($element[2])
            ->setPostalCode($element[3])
            ->setCity($element[4])
            ->setCountryCode($element[5]);

        $cinema = (new Cinema())
            ->setName($element[1])
            ->setAddress($address)
            ->setPhoneNumber($element[6])
        ;

        $this->addReference('Cinema_'.$element[0], $cinema);

        $manager->persist($cinema);

        return true;
    }
}
