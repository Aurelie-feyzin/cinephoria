<?php
declare(strict_types=1);

namespace App\Repository;

use App\Document\Review;
use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use Doctrine\Bundle\MongoDBBundle\Repository\ServiceDocumentRepository;

/**
 * @extends ServiceDocumentRepository<Review>
 */
class ReviewRepository extends ServiceDocumentRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    public function calculRating(string $movieId): float
    {
        $aggregation = $this->createAggregationBuilder()
            ->match()
            ->field('movieId')->equals($movieId)
            ->group()
            ->field('_id')->expression('$movieId')
            ->field('averageRating')->avg('$rating')
            ->getAggregation();

        $result = $aggregation->execute()->toArray();

        return empty($result) ? 0 : $result[0]['averageRating'];
    }
}
