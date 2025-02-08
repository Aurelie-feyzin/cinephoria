<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractTsvImport;
use App\Entity\Address;
use App\Entity\Cinema;
use App\Entity\MovieTheater;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Generator;

class CinemaFixtures extends AbstractTsvImport implements DependentFixtureInterface
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

        $numbersOfRooms = $faker->numberBetween(3, 5);
        for ($i = 0; $i < $numbersOfRooms; ++$i) {
            $movieTheater = $this->createMovieTheather($cinema, $i + 1, $faker);
            $manager->persist($movieTheater);
        }

        return true;
    }

    private function createMovieTheather(Cinema $cinema, int $numberRoom, Generator $faker): MovieTheater
    {
        return (new MovieTheater())
            ->setCinema($cinema)
            ->setTheaterName((string) $numberRoom)
            ->setProjectionQuality($this->getReference('Projection_quality_'.$faker->numberBetween(1, 5)))
            ->setNumberOfSeats($faker->numberBetween(100, 200))
            ->setReducedMobilitySeats($faker->numberBetween(2, 5))
        ;
    }

    public function getDependencies(): array
    {
        return [
            ProjectionQualityFixtures::class,
        ];
    }
}
