<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Movie;
use App\Entity\MovieShow;
use App\Entity\MovieTheater;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;

/** @SuppressWarnings(PHPMD.StaticAccess) */
class MovieShowFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies(): array
    {
        return [
            MovieFixtures::class,
            CinemaFixtures::class,
            OpeningHoursFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-FR');
        $allTheather = $manager->getRepository(MovieTheater::class)->findAll();
        /** @var Movie[] $allMovies */
        $allMovies = $manager->getRepository(Movie::class)->findAll();
        $firstWednseday = $this->getFirstDate();
        $numberOfProgrammingDays = 21;
        /** @var MovieTheater $theater */
        foreach ($allTheather as $theater) {
            for ($i = 0; $i < $numberOfProgrammingDays; ++$i) {
                $day = $firstWednseday->modify('+'.$i.' day');
                $startTime = $day->modify('+ 0 day 14:30');
                $movie = $this->getRandomMovie($allMovies, $faker, $day);
                $totalDuration = $movie->getDuration() + 20;
                $endTime = $startTime->modify('+'.$totalDuration.' minutes');
                while ($endTime->format('H:i') <= '22:00') {
                    $newMovieShow = (new MovieShow())
                        ->setMovieTheater($theater)
                        ->setMovie($movie)
                        ->setDate($day)
                        ->setStartTime($startTime->format('H:i'))
                        ->setEndTime($endTime->format('H:i'))
                        ->setPriceInCents($theater->getProjectionQuality()->getSuggestedPrice() / 100)
                    ;
                    $dayStartTime = $endTime;
                    $movie = $this->getRandomMovie($allMovies, $faker, $day);
                    $totalDuration = $movie->getDuration() + 20;
                    $endTime = $dayStartTime->modify('+'.$totalDuration.' minutes');

                    $manager->persist($newMovieShow);
                }
            }
            $manager->flush();
        }
    }

    private function getFirstDate(): DateTimeImmutable
    {
        $today = new DateTimeImmutable();
        $wednesday = $today->modify('last wednesday');

        return $wednesday->modify('-7 days');
    }

    /**
     * @param Movie[] $allMovies
     */
    private function getRandomMovie(array $allMovies, Generator $faker, DateTimeImmutable $day): Movie
    {
        $evenValidator = function ($movie) use ($day) {
            return $movie->getReleaseDate() <= $day;
        };

        /* @var Movie $movie */
        return $faker->valid($evenValidator)->randomElement($allMovies);
    }
}
