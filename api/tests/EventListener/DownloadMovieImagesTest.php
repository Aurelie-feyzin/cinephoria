<?php
declare(strict_types=1);

namespace App\Tests\EventListener;

use App\Entity\Movie;
use App\EventListener\DownloadMovieImages;
use App\Service\ImageDownloader;
use PHPUnit\Framework\TestCase;

class DownloadMovieImagesTest extends TestCase
{
    public function testPostPersistDownloadsImagesIfPathsExist(): void
    {
        $movie = $this->createMock(Movie::class);
        $movie->method('getBackdropPath')->willReturn('backdrop.jpg');
        $movie->method('getPosterPath')->willReturn('poster.jpg');

        $downloader = $this->createMock(ImageDownloader::class);

        $downloader->expects($this->exactly(2))
            ->method('download')
            ->willReturnCallback(function (string $url, string $path, string $dir) use (&$calls) {
                $calls[] = [$url, $path, $dir];
            });

        $calls = [];

        $listener = new DownloadMovieImages($downloader);
        $listener->postPersist($movie);
    }

    public function testPostPersistDoesNotDownloadWhenPathsAreEmpty(): void
    {
        $movie = $this->createMock(Movie::class);
        $movie->method('getBackdropPath')->willReturn(null);
        $movie->method('getPosterPath')->willReturn('');

        $downloader = $this->createMock(ImageDownloader::class);

        // download ne doit jamais être appelé
        $downloader->expects($this->never())->method('download');

        $listener = new DownloadMovieImages($downloader);
        $listener->postPersist($movie);
    }
}
