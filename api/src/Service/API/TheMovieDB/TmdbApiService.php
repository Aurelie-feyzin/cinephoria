<?php
declare(strict_types=1);

namespace App\Service\API\TheMovieDB;

use ApiPlatform\State\Pagination\TraversablePaginator;
use App\DTO\TmdbMovieDto;
use App\Factory\TmdbMovieFactory;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class TmdbApiService
{
    public function __construct(private readonly HttpClientInterface $client,
        private readonly TmdbMovieFactory $tmdbMovieFactory,
        private readonly string $tmdbAccessToken)
    {
    }

    /**
     * @param array<string, mixed> $params
     *
     * @return array<string, mixed>
     *
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    private function request(string $endpoint, array $params = []): array
    {
        $params = array_merge($params, [
            'include_adult' => false,
            'include_video' => false,
            'language' => 'fr-FR',
        ]);

        $response = $this->client->request('GET', "https://api.themoviedb.org/3/$endpoint", [
            'query' => $params,
            'headers' => [
                'Authorization' => 'Bearer '.$this->tmdbAccessToken,
                'accept' => 'application/json',
            ],
        ]);

        return $response->toArray();
    }

    /**
     * @return array<string, mixed> $params
     *
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function searchMovies(string $query, int $year): array
    {
        $params = [
            'query' => $query,
            'region' => 'FR',
            'watch_region' => 'FR',
            'certification_country' => 'FR',
            'with_release_type' => 3,
            'year' => $year,
        ];

        $response = $this->requestSearchMovies($params);

        if (0 === $response['total_results']) {
            ++$year;
            $params['year'] = $year;
            $response = $this->requestSearchMovies($params);
        }

        $movies = array_map(
            fn ($movie) => $this->tmdbMovieFactory->fromApi($movie),
            $response['results'] ?? []
        );

        $response['results'] = $movies;

        return $response;
    }

    /**
     * @param array<string, string> $param
     *
     * @return array<string, mixed> $params
     *
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function requestSearchMovies(array $param): array
    {
        return $this->request('search/movie', $param);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getUpcomingMovies(DateTimeImmutable $after, DateTimeImmutable $before): TraversablePaginator
    {
        $response = $this->request('discover/movie', [
            'primary_release_date.gte' => $after->format('Y-m-d'),
            'primary_release_date.lte' => $before->format('Y-m-d'),
            'region' => 'FR',
            'watch_region' => 'FR',
            'certification_country' => 'FR',
            'with_release_type' => 3,
        ]);

        $movies = array_map(
            fn ($movie) => $this->tmdbMovieFactory->fromApi($movie),
            $response['results'] ?? []
        );

        return new TraversablePaginator(new ArrayCollection($movies), $response['page'], 20, $response['total_results']);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getMovieDetails(int $tmdbId): TmdbMovieDto
    {
        $response = $this->request("movie/$tmdbId");

        return $this->tmdbMovieFactory->fromApi($response);
    }
}
