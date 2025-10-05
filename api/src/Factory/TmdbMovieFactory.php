<?php
declare(strict_types=1);

namespace App\Factory;

use App\DTO\TmdbMovieDto;
use App\Repository\MovieGenreRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Exception;

class TmdbMovieFactory
{
    public function __construct(private readonly MovieGenreRepository $genreRepository)
    {
    }

    /**
     * @param array<string, mixed> $data
     *
     * @throws Exception
     */
    public function fromApi(array $data): TmdbMovieDto
    {
        $genreIds = $data['genre_ids'] ?? array_map(
            static fn ($genre) => $genre['id'],
            $data['genres'] ?? []
        );
        $genres = $this->genreRepository->findBy(['tmbdId' => $genreIds]);

        return new TmdbMovieDto(
            idTmdb: $data['id'],
            title: $data['title'] ?? '',
            posterPath: $data['poster_path'] ? trim($data['poster_path'], '/') : null,
            backdropPath: $data['backdrop_path'] ? trim($data['backdrop_path'], '/') : null,
            duration: $data['runtime'] ?? null,
            description: $data['overview'] ?? null,
            releaseDate: isset($data['release_date']) && '' !== $data['release_date']
                ? (new DateTime($data['release_date']))
                : null,
            genres: new ArrayCollection($genres)
        );
    }
}
