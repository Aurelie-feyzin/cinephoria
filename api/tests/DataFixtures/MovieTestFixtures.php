<?php
declare(strict_types=1);

namespace App\Tests\DataFixtures;

use App\Entity\Movie;
use App\Enum\AgeRestriction;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MovieTestFixtures extends Fixture
{
    public const MOVIE_API_PATH = '/api/movies/';

    public function load(ObjectManager $manager): void
    {
        $movie = (new Movie())
            ->setTitle('Test Movie')
            ->setReleaseDate(new DateTimeImmutable())
            ->setAgeRestriction(AgeRestriction::ALL)
            ->setDuration(90);

        $this->addReference('movie', $movie);
        $manager->persist($movie);

        $manager->flush();
    }
}
