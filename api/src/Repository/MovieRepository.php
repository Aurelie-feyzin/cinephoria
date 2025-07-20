<?php
declare(strict_types=1);

namespace App\Repository;

use App\Entity\Movie;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Movie>
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    /**
     * @return Movie[]
     */
    public function getNewMovies(DateTimeImmutable $today): array
    {
        try {
            $lastWednesday = $today->modify('last wednesday');

            return $this->findBy(['releaseDate' => $lastWednesday]);
        } catch (\Exception $e) {
            return [];
        }
    }
}
