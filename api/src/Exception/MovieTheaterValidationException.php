<?php
declare(strict_types=1);

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class MovieTheaterValidationException extends BadRequestHttpException
{
    /**
     * @param string $message
     */
    public function __construct(
        protected $message,
    ) {
        parent::__construct($message);
    }
}
