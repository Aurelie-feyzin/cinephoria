<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\Service\MovieShowFixturesHelper;
use App\Entity\Movie;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

/** @SuppressWarnings(PHPMD.StaticAccess) */
class AdditionalMovieShowFixtures extends Fixture implements FixtureGroupInterface
{
    public function __construct(
        private readonly MovieShowFixturesHelper $movieShowFixturesHelper,
        private readonly MovieFixtures $movieFixtures,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $this->updateMovieReleaseDate($manager);
        $this->movieShowFixturesHelper->load($manager);
    }

    private function updateMovieReleaseDate(ObjectManager $manager): void
    {
        /** @var Movie[] $allMovies */
        $allMovies = $manager->getRepository(Movie::class)->findAll();
        $faker = Factory::create('fr-FR');

        foreach ($allMovies as $movie) {
            $newReleaseDate = $this->movieFixtures->createDateRelease($faker);
            $movie->setReleaseDate($newReleaseDate);
            $manager->persist($movie);
        }

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['append'];
    }
}
