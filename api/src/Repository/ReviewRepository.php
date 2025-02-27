<?php
declare(strict_types=1);

namespace App\Repository;

use ApiPlatform\State\Pagination\TraversablePaginator;
use App\Document\Review;
use App\Enum\ReviewStatus;
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

    public function getReviewsByMovie(string $movieId, int $itemsPerPage = 5, int $page = 1): TraversablePaginator
    {
        $firstResult = ($page - 1) * $itemsPerPage;

        $queryBuilder = $this->getDocumentManager()->createQueryBuilder(Review::class)
            ->field('movieId')->equals($movieId)
            ->field('status')->equals(ReviewStatus::PUBLISHED);

        $queryBuilder->skip($firstResult)
        ->limit($itemsPerPage);

        $reviews = $queryBuilder->getQuery()->execute();

        $totalReviews = $this->getDocumentManager()->createQueryBuilder(Review::class)
            ->field('movieId')->equals($movieId)
            ->field('status')->equals(ReviewStatus::PUBLISHED)
            ->count()
            ->getQuery()
            ->execute();

        return new TraversablePaginator($reviews, $page, $itemsPerPage, $totalReviews);
    }
}
