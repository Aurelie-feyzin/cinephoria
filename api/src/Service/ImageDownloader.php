<?php
declare(strict_types=1);

namespace App\Service;

use RuntimeException;

class ImageDownloader
{
    public function download(string $imageUrl, string $path, string $targetDirectory): void
    {
        $filename = basename($path);

        if (!is_dir($targetDirectory) && !mkdir($targetDirectory, 0775, true) && !is_dir($targetDirectory)) {
            throw new RuntimeException("Impossible de créer le dossier : $targetDirectory");
        }

        $filePath = rtrim($targetDirectory, '/').'/'.$filename;

        $imageContent = file_get_contents($imageUrl);

        if (false === $imageContent) {
            throw new RuntimeException("Impossible de télécharger l'image : $imageUrl");
        }

        file_put_contents($filePath, $imageContent);
    }
}
