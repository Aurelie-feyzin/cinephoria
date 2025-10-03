<?php
declare(strict_types=1);

namespace App\Tests\EventSubscriber;

use ApiPlatform\Validator\ValidatorInterface;

final class DummyValidator implements ValidatorInterface
{
    /**
     * @param array<string, mixed> $context
     *                                      {@inheritdoc}
     */
    public function validate(mixed $data, array $context = []): void
    {
        // only test, not real validation
    }
}
