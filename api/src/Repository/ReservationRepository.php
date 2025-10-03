<?php
declare(strict_types=1);

namespace App\Repository;

use App\Document\Reservation;
use DateTimeInterface;
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
        return $this->getDocumentManager()->createQueryBuilder(Reservation::class)
            ->field('movieShowId')->equals($movieShowUri);
    }

    /**
     * @return array<int<0, max>, string>
     *
     * @throws MongoDBException
     */
    public function findReservedSeatsForMovieShow(string $movieShowUri): array
    {
        $reservations = $this->reservedSeatsForMovieShowBuilder($movieShowUri)->getQuery()->execute();
        // Extract the seat IDs from the reservations
        $reservedSeats = [];
        /** @var Reservation $reservation */
        foreach ($reservations as $reservation) {
            foreach ($reservation->getSeatIds() as $seatIds) {
                $reservedSeats[] = $seatIds;
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
     * @return array<string, int>
     */
    public function getReservationsGroupedBy(string $groupByField, DateTimeInterface $startDate, DateTimeInterface $endDate): array
    {
        $query = $this->createAggregationBuilder()
            ->match()
            ->field('movieShowDate')->gte($startDate)
            ->field('movieShowDate')->lte($endDate)
            ->group()
            ->field('_id')->expression('$'.$groupByField)
            ->field('count')->sum(1)
            ->sort(['_id' => 1]);

        $result = $query->getAggregation()->execute()->toArray();

        return array_column($result, 'count', '_id');
    }

    /**
     * @return array<string, int>
     */
    public function getReservationsGroupedByDate(DateTimeInterface $startDate, DateTimeInterface $endDate): array
    {
        $query = $this->createAggregationBuilder()
            ->match()
            ->field('movieShowDate')->gte($startDate)
            ->field('movieShowDate')->lte($endDate)
            ->group()
            ->field('_id')->expression(['$dateToString' => ['format' => '%Y-%m-%d', 'date' => '$movieShowDate']])
            ->field('count')->sum(1)
            ->sort(['_id' => 1]);

        $result = $query->getAggregation()->execute()->toArray();

        return array_column($result, 'count', '_id');
    }

    /**
     * @param DateTimeInterface $date
     *
     * @return Reservation[]
     */
    public function findFuturReservationForUser(string $userId, $date): array
    {
        return $this->createQueryBuilder()
            ->field('userId')->equals($userId)
            ->field('movieShowDate')->gte($date)
            ->getQuery()
        ->toArray();
    }
}
