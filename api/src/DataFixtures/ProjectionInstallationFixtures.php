<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\MovieTheater;
use App\Entity\ProjectionInstallation;
use App\Enum\InstallationStatus;
use DateTimeImmutable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

/** @SuppressWarnings(PHPMD.StaticAccess) */
class ProjectionInstallationFixtures extends Fixture implements DependentFixtureInterface
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
            $projectionInstallation = (new ProjectionInstallation())
                ->setMovieTheater($theater)
                ->setName($theater->getProjectionQuality()->getName())
                ->setProjectionQuality($theater->getProjectionQuality())
                ->setStatus($faker->boolean(90) ? InstallationStatus::AVAILABLE : $faker->randomElement(InstallationStatus::class))
            ;
            $manager->persist($projectionInstallation);
            if (InstallationStatus::AVAILABLE !== $projectionInstallation->getStatus()) {
                $date = DateTimeImmutable::createFromMutable($faker->dateTimeThisDecade());
                $isLastMaintenanceDate = $faker->boolean();
                $projectionInstallation->setRepairDetails($faker->realTextBetween())
                    ->setLastMaintenanceDate($isLastMaintenanceDate ? $date : null)
                    ->setLastRepairDate($isLastMaintenanceDate ? null : $date);
            }
        }
        $manager->flush();
    }
}
