<?php
declare(strict_types=1);

namespace App\Tests\Controller;

use App\Controller\TmdbController;
use App\Service\API\TheMovieDB\TmdbApiService;
use DateTimeImmutable;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class TmdbControllerTest extends TestCase
{
    public function testSearchReturnsErrorWhenTitleIsMissing(): void
    {
        $tmdbServiceMock = $this->createMock(TmdbApiService::class);
        $controller = new TmdbController($tmdbServiceMock);

        // On simule une requête sans "title"
        $request = new Request([], [], [], [], [], [], json_encode([]));

        $response = $controller->search($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertSame(400, $response->getStatusCode());
        $this->assertSame(['error' => 'Missing query'], json_decode($response->getContent(), true));
    }

    public function testSearchReturnsResultsWhenTitleIsProvided(): void
    {
        $tmdbServiceMock = $this->createMock(TmdbApiService::class);
        $controller = new TmdbController($tmdbServiceMock);

        $title = 'Inception';
        $year = (int) (new DateTimeImmutable())->format('Y');
        $expectedResults = ['results' => [['id' => 1, 'title' => 'Inception']]];

        // On attend un appel correct
        $tmdbServiceMock
            ->expects($this->once())
            ->method('searchMovies')
            ->with($title, $year)
            ->willReturn($expectedResults);

        // Requête contenant un "title"
        $request = new Request([], [], [], [], [], [], json_encode(['title' => $title]));

        $response = $controller->search($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame(
            $expectedResults['results'],
            json_decode($response->getContent(), true)
        );
    }
}
