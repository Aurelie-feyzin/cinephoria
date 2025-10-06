<?php
declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Movie;
use App\Service\ImageDownloader;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Exception;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Movie::class)]
class DownloadMovieImages
{
    private const TMDB_IMAGE_PATH = 'https://image.tmdb.org/t/p/original/';

    private const SHARED_DIR = '/shared/public';

    private string $posterDir;
    private string $backdropDir;

    public function __construct(private readonly ImageDownloader $downloader)
    {
        $this->posterDir = self::SHARED_DIR.'/poster';
        $this->backdropDir = self::SHARED_DIR.'/backdrop';
    }

    /**
     * @throws Exception
     */
    public function postPersist(Movie $movie): void
    {
        if (!empty($movie->getBackdropPath())) {
            $this->downloader->download(
                self::TMDB_IMAGE_PATH.$movie->getBackdropPath(),
                $movie->getBackdropPath(),
                $this->backdropDir
            );
        }

        if (!empty($movie->getPosterPath())) {
            $this->downloader->download(
                self::TMDB_IMAGE_PATH.$movie->getPosterPath(),
                $movie->getPosterPath(),
                $this->posterDir
            );
        }
    }
}
