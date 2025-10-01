<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\MovieTheater;
use App\Entity\Seat;
use App\Enum\InstallationStatus;
use App\Exception\MovieTheaterValidationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/** @implements ProcessorInterface<MovieTheater, mixed> */
final class MovieTheaterStateProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<MovieTheater, mixed> $innerProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $innerProcessor,
        private readonly EntityManagerInterface $manager)
    {
    }

    /**
     * @param MovieTheater $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): MovieTheater
    {
        $numberOfSeats = $data->getNumberOfSeats();
        $reducedMobilitySeats = $data->getReducedMobilitySeats();

        $oldData = $context['previous_data'] ?? null;
        if ($oldData instanceof MovieTheater && $reducedMobilitySeats < $oldData->getReducedMobilitySeats()) {
            throw new MovieTheaterValidationException('Impossible de modifier le nombre de place à mobilité réduite');
        }

        if ($oldData instanceof MovieTheater && $numberOfSeats < $oldData->getNumberOfSeats()) {
            throw new MovieTheaterValidationException('Impossible de modifier le nombre de place');
        }

        for ($i = 0; $i < $numberOfSeats; ++$i) {
            $seat = (new Seat())
                ->setMovieTheater($data)
                ->setStatus(InstallationStatus::AVAILABLE)
                ->setName((string) ($i + 1))
                ->setReducedMobilitySeat($i < $reducedMobilitySeats);
            $this->manager->persist($seat);
        }
        $this->innerProcessor->process($data, $operation, $uriVariables, $context);
        $this->manager->flush();

        return $data;
    }
}
