<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Document\Reservation;
use App\Entity\Movie;
use App\Repository\MovieRepository;

/**
 * @implements ProviderInterface<Reservation>
 */
class CreateReservationProvider implements ProviderInterface
{

    /**
     * {@inheritdoc}
     *
     * @return Reservation
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        dump($operation);
        dump($uriVariables);
        dump($context);

       // return $this->movieRepository->getNewMovies($today);
    }
}