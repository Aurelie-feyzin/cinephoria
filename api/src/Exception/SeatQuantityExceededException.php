<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class SeatQuantityExceededException extends BadRequestHttpException
{
    public function __construct(
        private readonly int $requested,
        private readonly int $available,
    ) {
        parent::__construct(
            sprintf(
                'Impossible de réserver %d place%s: seulement %d encore disponible%s.',
                $requested,
                $requested > 1 ? 's' : '',
                $available,
                $available > 1 ? 's' : ''
            )
        );
    }

    public function getRequested(): int
    {
        return $this->requested;
    }

    public function getAvailable(): int
    {
        return $this->available;
    }
}