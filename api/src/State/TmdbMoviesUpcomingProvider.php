<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\DTO\TmdbMovieDto;
use App\Service\API\TheMovieDB\TmdbApiService;
use DateTimeImmutable;

/**
 * @implements ProviderInterface<TmdbMovieDto>
 */
class TmdbMoviesUpcomingProvider implements ProviderInterface
{
    public function __construct(
        private readonly TmdbApiService $tmdbApiService,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $after = new DateTimeImmutable();
        $before = $after->modify('1 month');

        return $this->tmdbApiService->getUpcomingMovies($after, $before);
    }
}
