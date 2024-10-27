<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\MovieGenre;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MovieGenreFixtures extends Fixture
{
    /** @var string */
    private const DATA_PATH = 'src/DataFixtures/data/genres.json';

    private string $dataFolderPath;

    public function __construct(string $rootDirectory)
    {
        $this->dataFolderPath = $rootDirectory.'/'.self::DATA_PATH;
    }

    public function load(ObjectManager $manager): void
    {
        $genresJson = file_get_contents($this->dataFolderPath);
        $genres = json_decode($genresJson, true, 512, JSON_THROW_ON_ERROR);
        foreach ($genres['genres'] as $arrayGenre) {
            $genre = (new MovieGenre())
            ->setName($arrayGenre['name'])
            ->setTmbdId($arrayGenre['id']);
            $this->addReference('Genre_'.$arrayGenre['id'], $genre);
            $manager->persist($genre);
        }
        $manager->flush();
    }
}
