<?php
declare(strict_types=1);

namespace App\Repository;

use App\Entity\MovieShow;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Uid\Uuid;

/**
 * @extends ServiceEntityRepository<MovieShow>
 */
class MovieShowRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MovieShow::class);
    }

    /**
     * @return MovieShow[]
     */
    public function getMovieShowsByCinema(string $today, string $lastDay, Uuid $cinemaId): array
    {
        try {
            return $this->createQueryBuilder('ms')
                ->join('ms.movieTheater', 'mt')
                ->where('mt.cinema = :cinemaId')
                ->andWhere('ms.date >= :today')
                ->andWhere('ms.date <= :lastDay')
                ->setParameter('cinemaId', $cinemaId)
                ->setParameter('today', $today)
                ->setParameter('lastDay', $lastDay)
                ->getQuery()
                ->getResult()
            ;
        } catch (\Exception $e) {
            return [];
        }
    }
}
