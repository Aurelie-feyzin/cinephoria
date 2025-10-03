<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Document\Reservation;
use App\Entity\User;
use App\Repository\ReservationRepository;
use App\State\UserReservationsProvider;
use DateTime;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Uid\UuidV4;

class UserReservationsProviderTest extends TestCase
{
    private Reservation $futureReservation;
    private Reservation $pastReservation;
    private UserReservationsProvider $provider;

    public function testThrowsIfNoUser(): void
    {
        $repo = $this->createMock(ReservationRepository::class);
        $security = $this->createMock(Security::class);
        $security->method('getUser')->willReturn(null);

        $this->provider = new UserReservationsProvider($repo, $security);
        $this->expectException(UserNotFoundException::class);
        $this->provider->provide($this->createMock(Operation::class), [], []);
    }

    private function initializeSetup(): void
    {
        $user = new User();
        $userUuid = new UuidV4();
        $user->setId($userUuid);

        $this->futureReservation = new Reservation();
        $this->futureReservation->setUserId($userUuid->toRfc4122())->setMovieShowDate(new DateTimeImmutable('+1 day'));

        $this->pastReservation = new Reservation();
        $this->pastReservation->setUserId($userUuid->toRfc4122())->setMovieShowDate(new DateTimeImmutable('-1 day'));

        $repo = $this->createMock(ReservationRepository::class);
        $repo->method('findBy')->willReturn([$this->futureReservation, $this->pastReservation]);

        $security = $this->createMock(Security::class);
        $security->method('getUser')->willReturn($user);

        $this->provider = new UserReservationsProvider($repo, $security);
    }

    public function testReturnsAllReservationsWithoutFilters(): void
    {
        $this->initializeSetup();
        $reservations = $this->provider->provide($this->createMock(Operation::class), [], ['filters' => []]);
        $this->assertCount(2, $reservations);
    }

    public function testReturnsOnlyPastReservations(): void
    {
        $this->initializeSetup();
        $reservations = $this->provider->provide($this->createMock(Operation::class), [], [
            'filters' => ['past' => 'true'],
        ]);

        $this->assertCount(1, $reservations);
        $this->assertSame($this->pastReservation, $reservations[0]);
    }

    public function testReturnsOnlFuturReservations(): void
    {
        $this->initializeSetup();
        $reservations = $this->provider->provide($this->createMock(Operation::class), [], [
            'filters' => ['past' => 'false'],
        ]);

        $this->assertCount(1, $reservations);
        $this->assertSame($this->futureReservation, $reservations[0]);
    }

    public function testReturnsOnlyFutureReservationsWithDate(): void
    {
        $this->initializeSetup();
        $reservations = $this->provider->provide($this->createMock(Operation::class), [], [
            'filters' => ['movieShowDate' => ['after' => (new DateTime())->format('Y-m-d')]],
        ]);

        $this->assertCount(1, $reservations);
        $this->assertSame($this->futureReservation, $reservations[0]);
    }
}
