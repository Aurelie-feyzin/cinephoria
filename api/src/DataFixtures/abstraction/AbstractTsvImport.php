<?php

declare(strict_types=1);

namespace App\DataFixtures\abstraction;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use SplFileObject;

/** @SuppressWarnings(PHPMD.StaticAccess) */
abstract class AbstractTsvImport extends Fixture
{
    /** @var string */
    private const DATA_FOLDER = 'src/DataFixtures/data/';

    private string $dataFolderPath;

    public function __construct(string $rootDirectory)
    {
        $this->dataFolderPath = $rootDirectory.'/'.self::DATA_FOLDER;
    }

    private function initTSV(): SplFileObject
    {
        $csv = new SplFileObject($this->dataFolderPath.$this->getTsvFilename(), 'r');
        $csv->setCsvControl("\t");
        $csv->setFlags(SplFileObject::READ_CSV | SplFileObject::READ_AHEAD | SplFileObject::SKIP_EMPTY | SplFileObject::DROP_NEW_LINE);

        return $csv;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-FR');
        /** @var mixed[] $element */
        foreach ($this->initTSV() as $element) {
            if (empty($element) && $this->skipEmptyLine()) {
                continue;
            }
            /* @var EntityManagerInterface $manager */
            /* @phpstan-ignore-next-line */
            if (!$this->insertItem($manager, $faker, $element)) {
                break;
            }
        }

        $manager->flush();
    }

    /**
     * @param mixed[] $values
     */
    public function arrayVal(array $values, int $index, ?string $default = null): ?string
    {
        return isset($values[$index]) && '' !== trim($values[$index]) ? $values[$index] : $default;
    }

    /**
     * @param mixed[] $element
     */
    abstract public function insertItem(EntityManagerInterface $manager, Generator $faker, array $element): bool;

    abstract public function getTsvFilename(): string;

    abstract public function skipEmptyLine(): bool;
}
