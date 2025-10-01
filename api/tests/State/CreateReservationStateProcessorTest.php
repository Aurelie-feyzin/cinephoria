<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Document\Reservation;
use App\DTO\ReservationDto;
use App\Entity\Cinema;
use App\Entity\Movie;
use App\Entity\MovieShow;
use App\Entity\MovieTheater;
use App\Entity\Seat;
use App\Entity\User;
use App\Exception\SeatQuantityExceededException;
use App\Repository\SeatRepository;
use App\State\CreateReservationStateProcessor;
use Doctrine\ODM\MongoDB\DocumentManager;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;

class CreateReservationStateProcessorTest extends TestCase
{
    private DocumentManager&MockObject $documentManager;
    private Security&MockObject $security;
    private SeatRepository&MockObject $seatRepository;
    private CreateReservationStateProcessor $processor;

    protected function setUp(): void
    {
        $this->documentManager = $this->createMock(DocumentManager::class);
        $this->security = $this->createMock(Security::class);
        $this->seatRepository = $this->createMock(SeatRepository::class);

        $this->processor = new CreateReservationStateProcessor(
            $this->documentManager,
            $this->security,
            $this->seatRepository
        );
    }

    public function testThrowsIfNoUser(): void
    {
        $this->security->method('getUser')->willReturn(null);

        $this->expectException(UserNotFoundException::class);

        $dto = $this->createMock(ReservationDto::class);
        $this->processor->process($dto, $this->createMock(Operation::class));
    }

    public function testThrowsIfTooManySeatsRequested(): void
    {
        $user = $this->createConfiguredMock(User::class, ['getId' => 'user-1']);
        $this->security->method('getUser')->willReturn($user);

        $dto = $this->createMock(ReservationDto::class);
        $dto->method('getNumberOfSeats')->willReturn(5);
        $dto->method('getSeats')->willReturn([]);

        $movie = $this->createConfiguredMock(Movie::class, ['getId' => 'movie-1', 'getTitle' => 'Test', 'getBackdropPath' => 'backdrop.jpg']);
        $cinema = $this->createConfiguredMock(Cinema::class, ['getId' => 'cinema-1', 'getName' => 'MyCinema']);
        $theater = $this->createConfiguredMock(MovieTheater::class, ['getId' => 'theater-1', 'getTheaterName' => 'Salle 1', 'getCinema' => $cinema]);
        $movieShow = $this->createConfiguredMock(MovieShow::class, [
            'getId' => 'show-1',
            'getMovie' => $movie,
            'getMovieTheater' => $theater,
            'getDate' => new \DateTimeImmutable('2025-10-01'),
            'getStartTime' => '20:00',
            'getEndTime' => '22:00',
        ]);
        $dto->method('getMovieShow')->willReturn($movieShow);

        $this->seatRepository->method('findAvailableSeatsForMovieShow')->willReturn([
            (new Seat())->setName('s1'), (new Seat())->setName('s2'), (new Seat())->setName('s3'),
        ]);

        $this->expectException(SeatQuantityExceededException::class);

        $this->processor->process($dto, $this->createMock(Operation::class));
    }

    public function testCreatesReservationWithValidSeats(): void
    {
        $user = $this->createConfiguredMock(User::class, ['getId' => 'user-1']);
        $this->security->method('getUser')->willReturn($user);

        $seat1 = $this->createConfiguredMock(Seat::class, ['getId' => 's1', 'getName' => 'A1']);
        $seat2 = $this->createConfiguredMock(Seat::class, ['getId' => 's2', 'getName' => 'A2']);
        $seat3 = $this->createConfiguredMock(Seat::class, ['getId' => 's3', 'getName' => 'A3']);
        $seat4 = $this->createConfiguredMock(Seat::class, ['getId' => 's4', 'getName' => 'A4']);

        $availableSeats = [$seat1, $seat2, $seat3, $seat4];

        $this->seatRepository->method('findAvailableSeatsForMovieShow')->willReturn($availableSeats);
        $this->seatRepository->method('find')->willReturnCallback(fn ($id) => match ($id) {
            's1' => $seat1,
            's2' => $seat2,
            's3' => $seat3,
            's4' => $seat4,
            default => null,
        });

        $dto = $this->createMock(ReservationDto::class);
        $dto->method('getNumberOfSeats')->willReturn(2);
        $dto->method('getSeats')->willReturn(['s2', 's3']);

        $movie = $this->createConfiguredMock(Movie::class, ['getId' => 'movie-1', 'getTitle' => 'Test', 'getBackdropPath' => 'backdrop.jpg']);
        $cinema = $this->createConfiguredMock(Cinema::class, ['getId' => 'cinema-1', 'getName' => 'MyCinema']);
        $theater = $this->createConfiguredMock(MovieTheater::class, ['getId' => 'theater-1', 'getTheaterName' => 'Salle 1', 'getCinema' => $cinema]);
        $movieShow = $this->createConfiguredMock(MovieShow::class, [
            'getId' => 'show-1',
            'getMovie' => $movie,
            'getMovieTheater' => $theater,
            'getDate' => new \DateTimeImmutable('2025-10-01'),
            'getStartTime' => '20:00',
            'getEndTime' => '22:00',
        ]);
        $dto->method('getMovieShow')->willReturn($movieShow);

        $this->documentManager->expects($this->once())->method('persist');
        $this->documentManager->expects($this->once())->method('flush');

        $reservation = $this->processor->process($dto, $this->createMock(Operation::class));

        $this->assertInstanceOf(Reservation::class, $reservation);
        $this->assertCount(2, $reservation->getSeatIds());
        $reservationIds = $reservation->getSeatIds();
        sort($reservationIds);
        $this->assertSame(['s2', 's3'], $reservationIds);
    }

    public function testCreatesReservationWithPartialValidSeats(): void
    {
        $user = $this->createConfiguredMock(User::class, ['getId' => 'user-1']);
        $this->security->method('getUser')->willReturn($user);

        $seat1 = $this->createConfiguredMock(Seat::class, ['getId' => 's1', 'getName' => 'A1']);
        $seat2 = $this->createConfiguredMock(Seat::class, ['getId' => 's2', 'getName' => 'A2']);
        $seat3 = $this->createConfiguredMock(Seat::class, ['getId' => 's3', 'getName' => 'A3']);
        $seat4 = $this->createConfiguredMock(Seat::class, ['getId' => 's4', 'getName' => 'A4']);

        $availableSeats = [$seat1, $seat2, $seat3, $seat4];

        $this->seatRepository->method('findAvailableSeatsForMovieShow')->willReturn($availableSeats);
        $this->seatRepository->method('find')->willReturnCallback(fn ($id) => match ($id) {
            's1' => $seat1,
            's2' => $seat2,
            's3' => $seat3,
            's4' => $seat4,
            default => null,
        });

        $dto = $this->createMock(ReservationDto::class);
        $dto->method('getNumberOfSeats')->willReturn(2);
        $dto->method('getSeats')->willReturn(['s2']);

        $movie = $this->createConfiguredMock(Movie::class, ['getId' => 'movie-1', 'getTitle' => 'Test', 'getBackdropPath' => 'backdrop.jpg']);
        $cinema = $this->createConfiguredMock(Cinema::class, ['getId' => 'cinema-1', 'getName' => 'MyCinema']);
        $theater = $this->createConfiguredMock(MovieTheater::class, ['getId' => 'theater-1', 'getTheaterName' => 'Salle 1', 'getCinema' => $cinema]);
        $movieShow = $this->createConfiguredMock(MovieShow::class, [
            'getId' => 'show-1',
            'getMovie' => $movie,
            'getMovieTheater' => $theater,
            'getDate' => new \DateTimeImmutable('2025-10-01'),
            'getStartTime' => '20:00',
            'getEndTime' => '22:00',
        ]);
        $dto->method('getMovieShow')->willReturn($movieShow);

        $this->documentManager->expects($this->once())->method('persist');
        $this->documentManager->expects($this->once())->method('flush');

        $reservation = $this->processor->process($dto, $this->createMock(Operation::class));

        $this->assertInstanceOf(Reservation::class, $reservation);
        $this->assertCount(2, $reservation->getSeatIds());
        $reservationIds = $reservation->getSeatIds();
        $this->assertContains('s2', $reservationIds);
    }
}
