<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\DTO\TmdbMovieDto;
use App\Service\API\TheMovieDB\TmdbApiService;

/**
 * @implements ProviderInterface<TmdbMovieDto>
 */
class TmdbMovieDetailProvider implements ProviderInterface
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
        $tmdbId = $uriVariables['idTmdb'];

        return $this->tmdbApiService->getMovieDetails($tmdbId);
    }
}
