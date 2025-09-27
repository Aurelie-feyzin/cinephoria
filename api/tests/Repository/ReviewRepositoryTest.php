<?php
declare(strict_types=1);

namespace App\Tests\Repository;

use App\Document\Reservation;
use App\Document\Review;
use App\Enum\ReviewStatus;
use App\Repository\ReviewRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;

class ReviewRepositoryTest extends KernelTestCase
{
    private DocumentManager $documentManager;
    private ReviewRepository $reviewRepository;

    /**
     * @throws MongoDBException
     */
    protected function setUp(): void
    {
        self::bootKernel();
        $this->documentManager = self::getContainer()->get(DocumentManager::class);
        /** @var ReviewRepository $reviewRepository */
        $reviewRepository = $this->documentManager->getRepository(Review::class);
        $this->reviewRepository = $reviewRepository;

        // Clear database before each test
        $this->documentManager->getDocumentCollection(Review::class)->drop();
    }

    /**
     * @param array<int, array{movieId: string, rating: int, status: ReviewStatus}> $reviewsData
     *
     * @dataProvider reviewDataProvider
     */
    public function testReviewRepositoryFunctional(array $reviewsData, string $movieId, float $expectedAverage, int $expectedTotal): void
    {
        // Create Review documents from data provider
        foreach ($reviewsData as $data) {
            $reservation = (new Reservation())->setMovieId($movieId);
            $this->documentManager->persist($reservation);
            $review = new Review();
            $review->setMovieId($data['movieId'])
                ->setRating($data['rating'])
                ->setStatus($data['status'])
                ->setReservation($reservation)
            ;
            $this->documentManager->persist($review);
        }
        $this->documentManager->flush();

        // Test calculRating()
        $average = $this->reviewRepository->calculRating($movieId);
        $this->assertEquals($expectedAverage, $average);

        // Test getReviewsByMovie pagination (5 per page, first page)
        $paginator = $this->reviewRepository->getReviewsByMovie($movieId, 5, 1);
        $this->assertCount(min($expectedTotal, 5), iterator_to_array($paginator));
        $this->assertEquals(1, $paginator->getCurrentPage());
        $this->assertEquals(5, $paginator->getItemsPerPage());
        $this->assertEquals($expectedTotal, $paginator->getTotalItems());
    }

    /**
     * @return array<string, array<int, array<int, array<string, ReviewStatus|int|string>>|float|int|string>>
     */
    public function reviewDataProvider(): array
    {
        $movieId1 = (new UuidV4())->toRfc4122();
        $movieId3 = (new UuidV4())->toRfc4122();

        return [
            // Case 1: multiple published reviews
            'multiple reviews' => [
                [
                    ['movieId' => $movieId1, 'rating' => 4, 'status' => ReviewStatus::PUBLISHED],
                    ['movieId' => $movieId1, 'rating' => 5, 'status' => ReviewStatus::SUBMITTED],
                    ['movieId' => $movieId1, 'rating' => 3, 'status' => ReviewStatus::REJECTED], // ignored
                ],
                $movieId1,   // movieId
                4.5,         // expected average
                1,           // expected total published reviews
            ],

            // Case 2: no reviews
            'no reviews' => [
                [],
                (new UuidV4())->toRfc4122(),
                0.0,
                0,
            ],

            // Case 3: more than page size
            'pagination test' => [
                array_map(fn ($i) => [
                    'movieId' => $movieId3,
                    'rating' => 3 + $i % 2,
                    'status' => ReviewStatus::PUBLISHED,
                ], range(1, 7)), // 7 reviews
                $movieId3,
                3.6,
                7,
            ],
        ];
    }
}
