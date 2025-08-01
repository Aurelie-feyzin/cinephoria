<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractMovieFixtures;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class MovieShowInitializationFixtures extends AbstractMovieFixtures implements DependentFixtureInterface
{
    public function getDependencies(): array
    {
        return [
            MovieFixtures::class,
            CinemaFixtures::class,
            OpeningHoursFixtures::class,
        ];
    }
}
