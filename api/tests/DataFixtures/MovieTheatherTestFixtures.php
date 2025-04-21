<?php
declare(strict_types=1);

namespace App\Tests\DataFixtures;

use App\Entity\Cinema;
use App\Entity\MovieTheater;
use App\Entity\ProjectionQuality;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class MovieTheatherTestFixtures extends Fixture implements DependentFixtureInterface
{
    public const MOVIE_THEATHER_API_PATH = '/api/movie_theaters/';

    public function load(ObjectManager $manager): void
    {
        $projection = (new ProjectionQuality())
            ->setName('Test Quality')
            ->setFormat('format')
            ->setAudioSystem('audioSystem')
            ->setSuggestedPrice(1000)
        ;
        $manager->persist($projection);

        $theater = (new MovieTheater())
            ->setTheaterName('Test Theater')
            ->setCinema($this->getReference('cinema', Cinema::class))
            ->setNumberOfSeats(50)
            ->setReducedMobilitySeats(10)
            ->setProjectionQuality($projection);

        $this->addReference('theater', $theater);
        $manager->persist($theater);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CinemaTestFixtures::class,
        ];
    }
}
