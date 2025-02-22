<?php
declare(strict_types=1);

namespace App\Enum;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Trait\EnumTrait;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    description: 'Status used for an review',
    types: ['https://schema.org/Enumeration'],
    normalizationContext: ['groups' => ['read']]
),
    GetCollection(provider: ReviewStatus::class.'::getCases'),
    Get(provider: ReviewStatus::class.'::getCase'),
]
enum ReviewStatus: string
{
    use EnumTrait;
    case SUBMITTED = 'en cours de validation';
    case REJECTED = 'rejeté';
    case PUBLISHED = 'publié';

    #[Groups(['read', 'reservation', 'review'])]
    public function getValue(): string
    {
        return $this->value;
    }
}
