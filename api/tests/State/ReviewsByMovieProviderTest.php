<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use App\Repository\ReviewRepository;
use App\State\ReviewsByMovieProvider;
use ArrayIterator;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class ReviewsByMovieProviderTest extends TestCase
{
    private ReviewsByMovieProvider $provider;
    private ReviewRepository&MockObject $reviewRepository;

    protected function setUp(): void
    {
        $this->reviewRepository = $this->createMock(ReviewRepository::class);
        $this->provider = new ReviewsByMovieProvider($this->reviewRepository);
    }

    /**
     * @dataProvider providePaginationData
     */
    public function testProvideCallsRepositoryCorrectly(
        string $movieId,
        ?int $itemsPerPage,
        ?int $page,
        int $expectedItemsPerPage,
        int $expectedPage,
    ): void {
        $context = ['filters' => []];
        if (null !== $itemsPerPage) {
            $context['filters']['itemsPerPage'] = $itemsPerPage;
        }
        if (null !== $page) {
            $context['filters']['page'] = $page;
        }

        $operation = $this->createMock(Operation::class);

        // Crée un vrai TraversablePaginator avec des éléments factices
        $fakeItems = new ArrayIterator(['review1', 'review2']);
        $totalItems = $fakeItems->count();
        $expectedPaginator = new TraversablePaginator(
            $fakeItems,
            (float) $expectedPage,
            (float) $expectedItemsPerPage,
            (float) $totalItems
        );

        $this->reviewRepository
            ->expects($this->once())
            ->method('getReviewsByMovie')
            ->with($movieId, $expectedItemsPerPage, $expectedPage)
            ->willReturn($expectedPaginator);

        $result = $this->provider->provide($operation, ['id' => $movieId], $context);

        $this->assertSame($expectedPaginator, $result);
    }

    /**
     * @return array<string, array{string, ?int, ?int, int}>
     */
    public function providePaginationData(): array
    {
        return [
            'defaults' => ['movie123', null, null, 5, 1],
            'custom items per page' => ['movie456', 10, null, 10, 1],
            'custom page' => ['movie789', null, 3, 5, 3],
            'custom items and page' => ['movie999', 7, 2, 7, 2],
        ];
    }
}
