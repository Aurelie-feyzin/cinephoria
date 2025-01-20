<?php
declare(strict_types=1);

namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

class ContactDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $firstName,

        #[Assert\NotBlank]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $lastName,

        #[Assert\NotBlank]
        #[Assert\Length(min: 2, max: 180)]
        #[Assert\Email]
        public ?string $email,

        #[Assert\NotBlank]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $title,

        #[Assert\NotBlank]
        public ?string $description,
    ) {
    }
}
