<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Repository\ReservationRepository;
use App\State\DashboardStateProvider;
use DateTimeImmutable;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class DashboardStateProviderTest extends TestCase
{
    private DashboardStateProvider $provider;
    private ReservationRepository&MockObject $reservationRepository;

    protected function setUp(): void
    {
        $this->reservationRepository = $this->createMock(ReservationRepository::class);
        $this->provider = new DashboardStateProvider($this->reservationRepository);
    }

    /**
     * @param array<string, int> $byMovie
     * @param array<string, int> $byCinema
     * @param array<string, int> $byDay
     *
     * @dataProvider dashboardDataProvider
     */
    public function testProvideReturnsDashboardDto(array $byMovie, array $byCinema, array $byDay, DateTimeImmutable $today): void
    {
        $this->reservationRepository->method('getReservationsGroupedBy')
            ->willReturnCallback(function (string $field, DateTimeImmutable $start, DateTimeImmutable $end) use ($byMovie, $byCinema) {
                return match ($field) {
                    'movieName' => $byMovie,
                    'cinemaName' => $byCinema,
                    default => [],
                };
            });

        $this->reservationRepository->expects($this->once())
            ->method('getReservationsGroupedByDate')
            ->with($this->callback(fn ($date) => $date instanceof DateTimeImmutable), $this->callback(fn ($date) => $date instanceof DateTimeImmutable))
            ->willReturn($byDay);

        $operation = $this->createMock(Operation::class);
        $dashboardDto = $this->provider->provide($operation);

        $this->assertSame($byMovie, $dashboardDto->getReservationsByMovie());
        $this->assertSame($byCinema, $dashboardDto->getReservationsByCinema());
        $this->assertSame($byDay, $dashboardDto->getReservationsByDay());
    }

    /**
     * @return array<string, array{?array<string, int>, ?array<string, int>, ?array<string, int>, DateTimeImmutable}>
     */
    public function dashboardDataProvider(): array
    {
        $today = new DateTimeImmutable();

        return [
            'no reservations' => [[], [], [], $today],
            'partial reservations' => [
                ['Movie A' => 2],
                ['Cinema 1' => 2],
                ['2025-09-29' => 2],
                $today,
            ],
            'multiple reservations' => [
                ['Movie A' => 3, 'Movie B' => 5],
                ['Cinema 1' => 4, 'Cinema 2' => 4],
                [
                    $today->format('Y-m-d') => 2,
                    (new DateTimeImmutable('+1 day'))->format('Y-m-d') => 3,
                ],
                $today,
            ],
        ];
    }
}
