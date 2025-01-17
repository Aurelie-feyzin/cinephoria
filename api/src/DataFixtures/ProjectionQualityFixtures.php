<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\DataFixtures\abstraction\AbstractTsvImport;
use App\Entity\ProjectionQuality;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Generator;

class ProjectionQualityFixtures extends AbstractTsvImport
{
    private const FILENAME = 'projection_quality.tsv';

    public function getTsvFilename(): string
    {
        return self::FILENAME;
    }

    public function skipEmptyLine(): bool
    {
        return false;
    }

    /**
     * @param mixed[] $element
     */
    public function insertItem(EntityManagerInterface $manager, Generator $faker, array $element): bool
    {
        $projectionPrice = (new ProjectionQuality())
            ->setName($element[1])
            ->setFormat($element[2])
            ->setAudioSystem($element[3])
            ->setSuggestedPrice((int) $element[4])
        ;

        $this->addReference('Projection_quality_'.$element[0], $projectionPrice);
        $manager->persist($projectionPrice);

        return true;
    }
}
