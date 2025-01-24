<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\MovieShow;
use App\Repository\MovieShowRepository;
use DateTimeImmutable;

/**
 * @implements ProviderInterface<MovieShow>
 */
class ByCinemaMovieListProvider implements ProviderInterface
{
    public function __construct(private readonly MovieShowRepository $movieShowRepository)
    {
    }

    /**
     * {@inheritdoc}
     *
     * @return MovieShow[]
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $now = new DateTimeImmutable();
        $today = $now->format('Y-m-d');
        $lastDay = $now->modify('+6 day')->format('Y-m-d');
        $cinemaId = $uriVariables['id'] ?? null;

        return $this->movieShowRepository->getMovieShowsByCinema($today, $lastDay, $cinemaId);
    }
}
