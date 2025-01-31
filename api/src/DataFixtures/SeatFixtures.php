<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\MovieTheater;
use App\Entity\Seat;
use App\Enum\InstallationStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

/** @SuppressWarnings(PHPMD.StaticAccess) */
class SeatFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies(): array
    {
        return [
            CinemaFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-FR');
        $allTheather = $manager->getRepository(MovieTheater::class)->findAll();
        foreach ($allTheather as $theater) {
            $numberOfSeats = $theater->getNumberOfSeats();
            for ($i = 0; $i < $numberOfSeats; ++$i) {
                $seat = (new Seat())
                    ->setMovieTheater($theater)
                    ->setStatus($faker->boolean(75) ? InstallationStatus::AVAILABLE : $faker->randomElement(InstallationStatus::class))
                    ->setName((string) ($i + 1));
                $manager->persist($seat);
            }
            $manager->flush();
        }
    }
}
