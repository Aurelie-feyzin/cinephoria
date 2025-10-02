<?php
declare(strict_types=1);

namespace App\Tests\Repository;

use App\Entity\Movie;
use App\Repository\MovieRepository;
use DateTimeImmutable;
use Doctrine\Persistence\ManagerRegistry;
use PHPUnit\Framework\TestCase;

class MovieRepositoryTest extends TestCase
{
    /**
     * @dataProvider dateProvider
     *
     * @throws \Exception
     */
    public function testGetNewMoviesComputesLastWednesday(
        string $todayDate,
        string $expectedWednesday,
    ): void {
        $today = new DateTimeImmutable($todayDate);
        $expectedDate = new DateTimeImmutable($expectedWednesday);

        $movie = new Movie();
        $movie->setReleaseDate($expectedDate);

        $registry = $this->createMock(ManagerRegistry::class);

        $repository = $this->getMockBuilder(MovieRepository::class)
            ->setConstructorArgs([$registry])
            ->onlyMethods(['findBy'])
            ->getMock();

        $repository->expects($this->once())
            ->method('findBy')
            ->with(['releaseDate' => $expectedDate])
            ->willReturn([$movie]);

        $result = $repository->getNewMovies($today);

        $this->assertCount(1, $result);
        $this->assertSame($movie, $result[0]);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public function dateProvider(): array
    {
        return [
            'Thursday should return yesterday (Wednesday)' => [
                '2025-10-02', // Thursday
                '2025-10-01', // Wednesday
            ],
            'Monday should return last Wednesday' => [
                '2025-10-06', // Monday
                '2025-10-01', // Wednesday before
            ],
            'Sunday should return last Wednesday' => [
                '2025-10-05', // Sunday
                '2025-10-01', // Wednesday before
            ],
            'Wednesday should return today (not previous week)' => [
                '2025-10-01', // Wednesday
                '2025-10-01', // Same day
            ],
        ];
    }

    public function testGetNewMoviesReturnsEmptyArrayOnException(): void
    {
        $today = new DateTimeImmutable('2025-10-02');

        $registry = $this->createMock(ManagerRegistry::class);

        $repository = $this->getMockBuilder(MovieRepository::class)
            ->setConstructorArgs([$registry])
            ->onlyMethods(['findBy'])
            ->getMock();

        // Simule une exception
        $repository->expects($this->once())
            ->method('findBy')
            ->willThrowException(new \RuntimeException('DB error'));

        $result = $repository->getNewMovies($today);

        $this->assertSame([], $result);
    }
}
