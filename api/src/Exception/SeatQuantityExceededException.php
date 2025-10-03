<?php
declare(strict_types=1);

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class SeatQuantityExceededException extends BadRequestHttpException
{
    public function __construct(
        protected readonly int $requested,
        protected readonly int $available,
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
}
