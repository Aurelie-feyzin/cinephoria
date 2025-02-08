<?php
declare(strict_types=1);

namespace App\Repository;

use App\Entity\MovieShow;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
     * @param mixed[] $arrayFields
     *
     * @return MovieShow[]
     */
    public function findConflictingShow(array $arrayFields): array
    {
        $query = $this->createQueryBuilder('m')
            ->where('m.date = :date')
            ->andWhere('m.movieTheater = :movieTheater')
            ->andWhere(
                '(m.startTime < :endTime AND m.endTime > :startTime)'
            )
            ->setParameter('movieTheater', $arrayFields['movieTheater'])
            ->setParameter('date', $arrayFields['date'])
            ->setParameter('startTime', $arrayFields['startTime'])
            ->setParameter('endTime', $arrayFields['endTime'])
            ->getQuery();

        return $query->getResult();
    }
}
