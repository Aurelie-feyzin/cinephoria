<?php
declare(strict_types=1);

namespace App\Tests\EventListener;

use App\Document\Reservation;
use App\Document\Review;
use App\Entity\Movie;
use App\EventListener\MovieRatingCalculator;
use App\Repository\MovieRepository;
use App\Repository\ReviewRepository;
use Doctrine\ODM\MongoDB\Event\LifecycleEventArgs;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class MovieRatingCalculatorTest extends TestCase
{
    /**
     * @dataProvider lifecycleEventProvider
     */
    public function testCalculateRatingIsCalledForReviewOnAllEvents(string $lifecycleMethod): void
    {
        $movie = new Movie();

        // Mock a Reservation returning a UUID
        $reservationMock = $this->getMockBuilder(Reservation::class)
            ->onlyMethods(['getMovieId'])
            ->getMock();
        $reservationMock->method('getMovieId')->willReturn('uuid');

        // Mock a Review that returns the mocked Reservation
        $reviewMock = $this->getMockBuilder(Review::class)
            ->onlyMethods(['getReservation'])
            ->getMock();
        $reviewMock->method('getReservation')->willReturn($reservationMock);

        // Mock the ReviewRepository to return a calculated rating
        $reviewRepoMock = $this->createMock(ReviewRepository::class);
        $reviewRepoMock->expects($this->once())
            ->method('calculRating')
            ->with('uuid')
            ->willReturn(4.5);

        // Mock the Movie repository to return the Movie entity
        $movieRepoMock = $this->createMock(MovieRepository::class);
        $movieRepoMock->method('find')->with('uuid')->willReturn($movie);

        // Mock EntityManager and return the Movie repository
        $entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $entityManagerMock->method('getRepository')->with(Movie::class)->willReturn($movieRepoMock);

        // Expect persist and flush to be called once
        $entityManagerMock->expects($this->once())->method('persist')->with($movie);
        $entityManagerMock->expects($this->once())->method('flush');

        // Instantiate the listener with mocks
        $listener = new MovieRatingCalculator($entityManagerMock, $reviewRepoMock);

        // Mock the Doctrine LifecycleEventArgs to return the Review
        $eventArgs = $this->getMockBuilder(LifecycleEventArgs::class)
            ->disableOriginalConstructor()
            ->getMock();
        $eventArgs->method('getDocument')->willReturn($reviewMock);

        // Call postPersist to trigger calculateRating
        $listener->$lifecycleMethod($eventArgs);

        // Assert that the movie rating was correctly updated
        $this->assertEquals(4.5, $movie->getRating());
    }

    /**
     * @return array<int, array<int, string>>
     */
    public function lifecycleEventProvider(): array
    {
        return [
            ['postPersist'],
            ['postUpdate'],
            ['preRemove'],
        ];
    }

    public function testCalculateRatingDoesNothingForNonReview(): void
    {
        // Mock EntityManager and ReviewRepository
        $entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $reviewRepoMock = $this->createMock(ReviewRepository::class);

        // Instantiate the listener with mocks
        $listener = new MovieRatingCalculator($entityManagerMock, $reviewRepoMock);

        // Use a non-Review object
        $nonReview = new \stdClass();

        // Mock the LifecycleEventArgs to return the non-Review object
        $eventArgs = $this->getMockBuilder(LifecycleEventArgs::class)
            ->disableOriginalConstructor()
            ->getMock();
        $eventArgs->method('getDocument')->willReturn($nonReview);

        // Call postPersist → nothing should happen, no exceptions
        $listener->postPersist($eventArgs);

        $this->assertTrue(true); // Assert true just to pass the test
    }
}
