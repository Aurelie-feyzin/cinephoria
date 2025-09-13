<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\Service\MovieShowFixturesHelper;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class InitializeMovieShowFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public function getDependencies(): array
    {
        return [
            MovieFixtures::class,
            CinemaFixtures::class,
            OpeningHoursFixtures::class,
        ];
    }

    public function __construct(private readonly MovieShowFixturesHelper $movieShowFixturesHelper)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $this->movieShowFixturesHelper->load($manager);
    }

    public static function getGroups(): array
    {
        return ['initialize'];
    }
}
