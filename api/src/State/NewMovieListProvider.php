<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Movie;
use App\Repository\MovieRepository;
use DateTimeImmutable;

/**
 * @implements ProviderInterface<Movie>
 */
class NewMovieListProvider implements ProviderInterface
{
    public function __construct(private readonly MovieRepository $movieRepository)
    {
    }

    /**
     * {@inheritdoc}
     *
     * @return Movie[]
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $today = new DateTimeImmutable();

        return $this->movieRepository->getNewMovies($today);
    }
}
