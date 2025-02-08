<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractTsvImport;
use App\Entity\OpeningHours;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Generator;

class OpeningHoursFixtures extends AbstractTsvImport implements DependentFixtureInterface
{
    private const FILENAME = 'opening_hours.tsv';

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
            CinemaFixtures::class,
        ];
    }

    /**
     * @param mixed[] $element
     */
    public function insertItem(EntityManagerInterface $manager, Generator $faker, array $element): bool
    {
        $openingHours = (new OpeningHours())
            ->setCinema($this->getReference('Cinema_'.$element[0]))
            ->setDayOfWeek($element[1])
            ->setOpeningTime($element[2])
            ->setClosingTime($element[3])
        ;

        $manager->persist($openingHours);

        return true;
    }
}
