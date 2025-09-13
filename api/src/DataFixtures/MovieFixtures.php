<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractTsvImport;
use App\Entity\Movie;
use App\Entity\MovieGenre;
use App\Enum\AgeRestriction;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Generator;

class MovieFixtures extends AbstractTsvImport implements DependentFixtureInterface, FixtureGroupInterface
{
    private const FILENAME = 'movies.tsv';

    public function getTsvFilename(): string
    {
        return self::FILENAME;
    }

    public function skipEmptyLine(): bool
    {
        return false;
    }

    public function getDependencies(): array
    {
        return [
            MovieGenreFixtures::class,
        ];
    }

    /**
     * @param mixed[] $element
     */
    public function insertItem(EntityManagerInterface $manager, Generator $faker, array $element): bool
    {
        $movie = (new Movie())
            ->setTitle($element[0])
            ->setDescription($element[3])
            ->setBackdropPath($element[4])
            ->setPosterPath($element[5])
            ->setDuration((int) $element[7])
            ->setReleaseDate($this->createDateRelease($faker))
            ->setFavorite($faker->boolean(20))
            ->setWarning($faker->boolean(20))
            ->setAgeRestriction($faker->randomElement(AgeRestriction::class))
        ;

        foreach (explode(',', $element[1]) as $genre) {
            $movie->addGenre($this->getReference('Genre_'.$genre, MovieGenre::class));
        }

        $manager->persist($movie);

        return true;
    }

    public function createDateRelease(Generator $faker): DateTimeImmutable
    {
        $evenValidator = static function ($dateTime) {
            return '3' === $dateTime->format('w');
        };
        $today = new DateTimeImmutable();
        $endDate = '3' === $today->format('w') ? '+ 1 days' : '+7 days';
        $date = $faker->valid($evenValidator)->dateTimeBetween('-1 month', $endDate);

        return date_create_immutable($date->format('Y-m-d'));
    }

    public static function getGroups(): array
    {
        return ['initialize'];
    }
}
