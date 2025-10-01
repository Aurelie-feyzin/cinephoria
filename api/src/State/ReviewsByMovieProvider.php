<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use App\Document\Review;
use App\Repository\ReviewRepository;

/**
 * @implements ProviderInterface<Review>
 */
readonly class ReviewsByMovieProvider implements ProviderInterface
{
    public function __construct(private ReviewRepository $reviewRepository)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): TraversablePaginator
    {
        $itemsPerPage = $context['filters']['itemsPerPage'] ?? 5;
        $page = $context['filters']['page'] ?? 1;

        return $this->reviewRepository->getReviewsByMovie($uriVariables['id'], (int) $itemsPerPage, (int) $page);
    }
}
