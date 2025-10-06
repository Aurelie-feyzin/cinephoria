<?php
declare(strict_types=1);

namespace App\DTO;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Entity\MovieGenre;
use App\State\TmdbMovieDetailProvider;
use App\State\TmdbMoviesUpcomingProvider;
use Doctrine\Common\Collections\Collection;

#[ApiResource(
    operations: [
        new GetCollection(uriTemplate: '/movies/tmdb/upcoming', name: 'movies_tmdb_upcoming', provider: TmdbMoviesUpcomingProvider::class),
        new Get(uriTemplate: '/movies/tmdb/{idTmdb}', name: 'movies_tmdb_detail', provider: TmdbMovieDetailProvider::class),
    ],
    mercure: true,
    security: "is_granted('ROLE_EMPLOYEE')"
),
]
class TmdbMovieDto
{
    /**
     * @param Collection<int, MovieGenre> $genres
     */
    public function __construct(
        #[ApiProperty(identifier: true)]
        public readonly int $idTmdb,
        public readonly string $title,
        public readonly ?string $posterPath,
        public readonly ?string $backdropPath,
        public readonly ?int $duration,
        public readonly ?string $description,
        public readonly ?\DateTimeInterface $releaseDate,
        public readonly Collection $genres,
        // public readonly ?AgeRestriction $ageRestriction,
        // public readonly ?bool $warning,
    ) {
    }
}
