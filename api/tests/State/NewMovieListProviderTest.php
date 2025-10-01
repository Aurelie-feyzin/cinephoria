<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Entity\Movie;
use App\Repository\MovieRepository;
use App\State\NewMovieListProvider;
use DateTimeImmutable;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class NewMovieListProviderTest extends TestCase
{
    private NewMovieListProvider $provider;
    private MovieRepository&MockObject $movieRepository;

    protected function setUp(): void
    {
        $this->movieRepository = $this->createMock(MovieRepository::class);
        $this->provider = new NewMovieListProvider($this->movieRepository);
    }

    /**
     * @param Movie[] $expectedMovies
     *
     * @dataProvider provideMovieData
     */
    public function testProvideReturnsNewMovies(array $expectedMovies): void
    {
        $operation = $this->createMock(Operation::class);

        // On s'assure que getNewMovies est appelé avec un DateTimeImmutable "aujourd'hui"
        $this->movieRepository
            ->expects($this->once())
            ->method('getNewMovies')
            ->with($this->callback(fn ($date) => $date instanceof DateTimeImmutable))
            ->willReturn($expectedMovies);

        $result = $this->provider->provide($operation);

        $this->assertSame($expectedMovies, $result);
    }

    /**
     * @return array<string, array{Movie[]}>
     */
    public function provideMovieData(): array
    {
        $movie1 = $this->createMock(Movie::class);
        $movie2 = $this->createMock(Movie::class);

        return [
            'no movies' => [[]],
            'single movie' => [[$movie1]],
            'multiple movies' => [[$movie1, $movie2]],
        ];
    }
}
