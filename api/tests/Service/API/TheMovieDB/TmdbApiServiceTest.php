<?php
declare(strict_types=1);

namespace App\Tests\Service\API\TheMovieDB;

use App\DTO\TmdbMovieDto;
use App\Factory\TmdbMovieFactory;
use App\Service\API\TheMovieDB\TmdbApiService;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class TmdbApiServiceTest extends TestCase
{
    private HttpClientInterface&MockObject $client;
    private TmdbMovieFactory&MockObject $factory;
    private TmdbApiService $service;

    protected function setUp(): void
    {
        $this->client = $this->createMock(HttpClientInterface::class);
        $this->factory = $this->createMock(TmdbMovieFactory::class);

        $this->service = new TmdbApiService(
            $this->client,
            $this->factory,
            'fake_token'
        );
    }

    public function testGetMovieDetails(): void
    {
        $tmdbId = 123;
        $apiResponse = ['id' => $tmdbId, 'title' => 'Test Movie'];

        $responseMock = $this->createMock(ResponseInterface::class);
        $responseMock->method('toArray')->willReturn($apiResponse);

        $this->client->expects($this->once())
            ->method('request')
            ->with('GET', "https://api.themoviedb.org/3/movie/$tmdbId", $this->anything())
            ->willReturn($responseMock);

        $dtoMock = $this->createMock(TmdbMovieDto::class);

        $this->factory->expects($this->once())
            ->method('fromApi')
            ->with($apiResponse)
            ->willReturn($dtoMock);

        $result = $this->service->getMovieDetails($tmdbId);

        $this->assertSame($dtoMock, $result);
    }

    /**
     * @param array<string, mixed> $apiResponse
     * @param array<int>           $expectedDtoCounts
     *
     * @dataProvider searchMoviesProvider
     */
    public function testSearchMovies(array $apiResponse, array $expectedDtoCounts, int $year): void
    {
        $responseMock = $this->createMock(ResponseInterface::class);
        $responseMock->method('toArray')->willReturn($apiResponse);

        if (0 === $apiResponse['total_results']) {
            $responseMock1 = $this->createMock(ResponseInterface::class);
            $responseMock1->method('toArray')->willReturn($apiResponse);

            $responseMock2 = $this->createMock(ResponseInterface::class);
            $responseMock2->method('toArray')->willReturn($apiResponse);

            $this->client->expects($this->exactly(2))
                ->method('request')
                ->willReturnOnConsecutiveCalls($responseMock1, $responseMock2);
        } else {
            $responseMock = $this->createMock(ResponseInterface::class);
            $responseMock->method('toArray')->willReturn($apiResponse);

            $this->client->expects($this->once())
                ->method('request')
                ->willReturn($responseMock);
        }

        // Préparer les mocks DTOs pour chaque film
        $dtoMocks = array_map(fn () => $this->createMock(TmdbMovieDto::class), $apiResponse['results'] ?? []);

        // Factory doit être appelé autant de fois qu'il y a de films
        $this->factory->expects($this->exactly(count($dtoMocks)))
            ->method('fromApi')
            ->willReturnCallback(function ($movie) use (&$dtoMocks, &$callIndex) {
                return $dtoMocks[$callIndex++];
            });

        $callIndex = 0;

        $result = $this->service->searchMovies('Test', $year);

        $this->assertCount($expectedDtoCounts[0], $result['results']);
        foreach ($result['results'] as $index => $dto) {
            $this->assertSame($dtoMocks[$index], $dto);
        }
    }

    /**
     * @return array<string, array{0: array<string, mixed>, 1: array<int>, 2: int}>>
     */
    public function searchMoviesProvider(): array
    {
        return [
            'no results' => [
                [
                    'results' => [],
                    'total_results' => 0,
                    'page' => 1,
                    'total_pages' => 1,
                ],
                [0],
                2025,
            ],
            'one result' => [
                [
                    'results' => [['id' => 1, 'title' => 'Movie 1']],
                    'total_results' => 1,
                    'page' => 1,
                    'total_pages' => 1,
                ],
                [1],
                2025,
            ],
            'multiple results' => [
                [
                    'results' => [
                        ['id' => 1, 'title' => 'Movie 1'],
                        ['id' => 2, 'title' => 'Movie 2'],
                    ],
                    'total_results' => 2,
                    'page' => 1,
                    'total_pages' => 1,
                ],
                [2],
                2025,
            ],
        ];
    }

    public function testGetUpcomingMovies(): void
    {
        $after = new DateTimeImmutable('2025-10-01');
        $before = new DateTimeImmutable('2025-10-31');

        $apiResponse = [
            'results' => [['id' => 1], ['id' => 2]],
            'total_results' => 2,
            'page' => 1,
        ];

        $responseMock = $this->createMock(ResponseInterface::class);
        $responseMock->method('toArray')->willReturn($apiResponse);

        $this->client->expects($this->once())
            ->method('request')
            ->with('GET', 'https://api.themoviedb.org/3/discover/movie', $this->anything())
            ->willReturn($responseMock);

        $dtoMocks = [
            $this->createMock(TmdbMovieDto::class),
            $this->createMock(TmdbMovieDto::class),
        ];

        $callIndex = 0;
        $this->factory
            ->expects($this->exactly(count($dtoMocks)))
            ->method('fromApi')
            ->willReturnCallback(function ($movie) use (&$callIndex, $apiResponse, $dtoMocks) {
                self::assertSame(
                    $apiResponse['results'][$callIndex],
                    $movie,
                    "Appel inattendu de fromApi() pour l'index $callIndex"
                );

                return $dtoMocks[$callIndex++];
            });

        $paginator = $this->service->getUpcomingMovies($after, $before);

        $this->assertInstanceOf(ArrayCollection::class, $paginator->getIterator());
        $this->assertCount(2, iterator_to_array($paginator->getIterator()));
    }
}
