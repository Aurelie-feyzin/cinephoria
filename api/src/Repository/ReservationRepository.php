<?php
declare(strict_types=1);

namespace App\Repository;

use App\Document\Reservation;
use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use Doctrine\Bundle\MongoDBBundle\Repository\ServiceDocumentRepository;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\ODM\MongoDB\Query\Builder;

/**
 * @extends ServiceDocumentRepository<Reservation>
 */
class ReservationRepository extends ServiceDocumentRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservation::class);
    }

    // Create a MongoDB query to find all reservations for the specified MovieShow
    private function reservedSeatsForMovieShowBuilder(string $movieShowUri): Builder
    {
        return $this->createQueryBuilder()
            ->field('r.movieShowId')->equals($movieShowUri)
            ->field('r.seats')->exists(true);
    }

    /**
     * @return Reservation[]
     */
    public function findReservedSeatsForMovieShow(string $movieShowUri): array
    {
        $reservations = $this->reservedSeatsForMovieShowBuilder($movieShowUri)->getQuery()->toArray();

        // Extract the seat IDs from the reservations
        $reservedSeats = [];
        foreach ($reservations as $reservation) {
            foreach ($reservation['seats'] as $seat) {
                $reservedSeats[] = $seat->getId();
            }
        }

        return $reservedSeats;
    }

    /**
     * @throws MongoDBException
     */
    public function countReservedSeatsForMovieShow(string $movieShowUri): int
    {
        $queryBuilder = $this->reservedSeatsForMovieShowBuilder($movieShowUri);

        return $queryBuilder->count()->getQuery()->execute();
    }

    /**
     * @param \DateTimeInterface $date
     *
     * @return Reservation[]
     */
    public function findFuturReservationForUser(string $userId, $date): array
    {
        return $this->createQueryBuilder()
            ->field('r.userId')->equals($userId)
            ->field('r.movieShowDate')->gte($date)
            ->getQuery()
        ->toArray();
    }
}
