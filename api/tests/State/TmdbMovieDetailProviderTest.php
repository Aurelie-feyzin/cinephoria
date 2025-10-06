<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\DTO\TmdbMovieDto;
use App\Service\API\TheMovieDB\TmdbApiService;
use App\State\TmdbMovieDetailProvider;
use PHPUnit\Framework\TestCase;

class TmdbMovieDetailProviderTest extends TestCase
{
    public function testProvideCallsGetMovieDetailsWithCorrectId(): void
    {
        $tmdbId = 12345;

        $dtoMock = $this->createMock(TmdbMovieDto::class);

        $tmdbApiServiceMock = $this->createMock(TmdbApiService::class);
        $tmdbApiServiceMock->expects($this->once())
            ->method('getMovieDetails')
            ->with($tmdbId)
            ->willReturn($dtoMock);

        $provider = new TmdbMovieDetailProvider($tmdbApiServiceMock);

        $operation = $this->createMock(Operation::class);

        $result = $provider->provide($operation, ['idTmdb' => $tmdbId]);

        $this->assertSame($dtoMock, $result);
    }
}
