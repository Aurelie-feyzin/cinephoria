<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\API\TheMovieDB\TmdbApiService;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class TmdbController extends AbstractController
{
    private TmdbApiService $tmdb;

    public function __construct(TmdbApiService $tmdb)
    {
        $this->tmdb = $tmdb;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/movies/tmdb/search', name: 'movies_tmdb_search')]
    #[IsGranted('ROLE_EMPLOYEE')]
    public function search(Request $request): JsonResponse
    {
        $title = $request->getPayload()->get('title');

        if (!$title) {
            return new JsonResponse(['error' => 'Missing query'], 400);
        }
        $year = (int) (new DateTimeImmutable())->format('Y');

        $results = $this->tmdb->searchMovies($title, $year);

        return new JsonResponse($results['results']);
    }
}
