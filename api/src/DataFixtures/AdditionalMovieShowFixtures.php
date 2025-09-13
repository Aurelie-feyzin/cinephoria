<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\Service\MovieShowFixturesHelper;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class AdditionalMovieShowFixtures extends Fixture implements FixtureGroupInterface
{
    public function __construct(private readonly MovieShowFixturesHelper $movieShowFixturesHelper)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $this->movieShowFixturesHelper->load($manager);
    }

    public static function getGroups(): array
    {
        return ['append'];
    }
}
