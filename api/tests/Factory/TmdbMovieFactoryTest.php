<?php
declare(strict_types=1);

namespace App\Tests\Factory;

use App\DTO\TmdbMovieDto;
use App\Entity\MovieGenre;
use App\Factory\TmdbMovieFactory;
use App\Repository\MovieGenreRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Exception;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class TmdbMovieFactoryTest extends TestCase
{
    private MovieGenreRepository&MockObject $genreRepository;
    private TmdbMovieFactory $factory;

    protected function setUp(): void
    {
        $this->genreRepository = $this->createMock(MovieGenreRepository::class);
        $this->factory = new TmdbMovieFactory($this->genreRepository);
    }

    /**
     * @param array<string, mixed> $data
     * @param int[]                $expectedGenreIds
     *
     * @dataProvider movieDataProvider
     *
     * @throws Exception
     */
    public function testFromApi(array $data, array $expectedGenreIds): void
    {
        $genres = [
            $this->createMock(MovieGenre::class),
            $this->createMock(MovieGenre::class),
        ];

        $this->genreRepository
            ->expects($this->once())
            ->method('findBy')
            ->with(['tmbdId' => $expectedGenreIds])
            ->willReturn($genres);

        $dto = $this->factory->fromApi($data);

        $this->assertInstanceOf(TmdbMovieDto::class, $dto);
        $this->assertEquals($data['id'], $dto->idTmdb);
        $this->assertEquals($data['title'] ?? '', $dto->title);
        $this->assertEquals($data['poster_path'] ? trim($data['poster_path'], '/') : null, $dto->posterPath);
        $this->assertEquals($data['backdrop_path'] ? trim($data['backdrop_path'], '/') : null, $dto->backdropPath);
        $this->assertEquals($data['runtime'] ?? null, $dto->duration);
        $this->assertEquals($data['overview'] ?? null, $dto->description);

        if (!empty($data['release_date'])) {
            $this->assertEquals(new DateTime($data['release_date']), $dto->releaseDate);
        } else {
            $this->assertNull($dto->releaseDate);
        }

        $this->assertInstanceOf(ArrayCollection::class, $dto->genres);
        $this->assertCount(2, $dto->genres);
    }

    /**
     * @return array<string, array{array<string, mixed>, int[]}>
     */
    public function movieDataProvider(): array
    {
        return [
            'with genre_ids' => [
                [
                    'id' => 123,
                    'title' => 'Test Movie',
                    'poster_path' => '/poster.jpg',
                    'backdrop_path' => '/backdrop.jpg',
                    'runtime' => 120,
                    'overview' => 'Overview text',
                    'release_date' => '2025-10-10',
                    'genre_ids' => [1, 2],
                ],
                [1, 2],
            ],
            'with genres array' => [
                [
                    'id' => 456,
                    'title' => 'Another Movie',
                    'poster_path' => null,
                    'backdrop_path' => null,
                    'genres' => [
                        ['id' => 10],
                        ['id' => 20],
                    ],
                ],
                [10, 20],
            ],
            'with empty release_date' => [
                [
                    'id' => 789,
                    'title' => 'Movie No Date',
                    'poster_path' => null,
                    'backdrop_path' => null,
                    'genres' => [
                        ['id' => 30],
                    ],
                    'release_date' => '',
                ],
                [30],
            ],
        ];
    }
}
