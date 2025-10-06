<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\TraversablePaginator;
use App\Service\API\TheMovieDB\TmdbApiService;
use App\State\TmdbMoviesUpcomingProvider;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

class TmdbMoviesUpcomingProviderTest extends TestCase
{
    public function testProvideCallsServiceWithCorrectDates(): void
    {
        $tmdbServiceMock = $this->createMock(TmdbApiService::class);
        $provider = new TmdbMoviesUpcomingProvider($tmdbServiceMock);

        $now = new DateTimeImmutable();
        $expectedBefore = $now->modify('1 month');

        $expectedResult = new TraversablePaginator(
            new ArrayCollection([]),
            1,
            10,
            0
        );

        $tmdbServiceMock
            ->expects($this->once())
            ->method('getUpcomingMovies')
            ->with(
                $this->callback(function (DateTimeImmutable $after) use ($now) {
                    return abs($after->getTimestamp() - $now->getTimestamp()) < 3;
                }),
                $this->callback(function (DateTimeImmutable $before) use ($expectedBefore) {
                    return abs($before->getTimestamp() - $expectedBefore->getTimestamp()) < 3;
                })
            )
            ->willReturn($expectedResult);

        $operation = $this->createMock(Operation::class);

        $result = $provider->provide($operation);

        $this->assertSame($expectedResult, $result);
    }
}
