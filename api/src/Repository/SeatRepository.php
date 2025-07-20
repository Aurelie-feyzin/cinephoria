<?php
declare(strict_types=1);

namespace App\Repository;

use App\Entity\Seat;
use App\Enum\InstallationStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Seat>
 */
class SeatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private readonly ReservationRepository $reservationRepository)
    {
        parent::__construct($registry, Seat::class);
    }

    private function availableSeatsForMovieShowBuilder(string $movieShowId): QueryBuilder
    {
        return $this->createQueryBuilder('s')
            ->innerJoin('s.movieTheater', 'mt')
            ->innerJoin('mt.movieShows', 'm')
            ->where('m.id = :movieShowId')
            ->andWhere('s.status = :available')
            ->setParameter('movieShowId', $movieShowId)
            ->setParameter('available', InstallationStatus::AVAILABLE);
    }

    /**
     * @return Seat[]
     *
     * @throws MongoDBException
     */
    public function findAvailableSeatsForMovieShow(string $movieShowId): array
    {
        // Get the reserved seats for the specific MovieShow
        $reservedSeats = $this->reservationRepository->findReservedSeatsForMovieShow($movieShowId);

        // Build the Doctrine query to fetch available seats
        $queryBuilder = $this->availableSeatsForMovieShowBuilder($movieShowId);

        // Exclude the reserved seats from the result
        if (!empty($reservedSeats)) {
            $queryBuilder->andWhere('s.id NOT IN (:reservedSeats)')
                ->setParameter('reservedSeats', $reservedSeats);
        }

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @throws MongoDBException
     * @throws NonUniqueResultException
     * @throws NoResultException
     */
    public function countAvailableSeatsForMovieShow(string $movieShowId): int
    {
        // Get the reserved seats for the specific MovieShow
        $reservedSeats = $this->reservationRepository->countReservedSeatsForMovieShow($movieShowId);

        // Build the Doctrine query to fetch builder available seats
        $queryBuilder = $this->availableSeatsForMovieShowBuilder($movieShowId);

        return $queryBuilder->select('COUNT(s.id)')->getQuery()->getSingleScalarResult() - $reservedSeats;
    }
}
