<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\DTO\DashboardDto;
use App\Repository\ReservationRepository;
use DateTimeImmutable;

/**
 * @implements ProviderInterface<DashboardDto>
 */
readonly class DashboardStateProvider implements ProviderInterface
{
    public function __construct(
        private ReservationRepository $reservationRepository,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): DashboardDto
    {
        $today = new DateTimeImmutable();
        $endDate = $today->modify('+7 days');

        $reservationsByMovie = $this->reservationRepository->getReservationsGroupedBy('movieName', $today, $endDate);

        $reservationsByCinema = $this->reservationRepository->getReservationsGroupedBy('cinemaName', $today, $endDate);

        $reservationsByDay = $this->reservationRepository->getReservationsGroupedByDate($today, $endDate);

        return (new DashboardDto())
            ->setReservationsByMovie($reservationsByMovie)
            ->setReservationsByCinema($reservationsByCinema)
            ->setReservationsByDay($reservationsByDay);
    }
}
