<?php
declare(strict_types=1);

namespace App\Enum;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Trait\EnumTrait;
use Symfony\Component\Serializer\Attribute\Groups;

/** https://fr.wikipedia.org/wiki/Commission_de_classification_des_%C5%93uvres_cin%C3%A9matographiques
 * https://les-tilleuls.coop/blog/exposez-vos-enums-avec-api-platform.
 **/
#[ApiResource(
    description: 'Status used for a blog article',
    types: ['https://schema.org/Enumeration'],
    normalizationContext: ['groups' => ['read']]
),
    GetCollection(provider: AgeRestriction::class.'::getCases'),
    Get(provider: AgeRestriction::class.'::getCase'),
]
enum AgeRestriction: string
{
    use EnumTrait;
    case ALL = 'Tous publics';
    case TWELVE = '12 ans';
    case SIXTEEN = '16 ans';
    case EIGHTEEN = '18 ans';
    case EIGHTEEN_X = '18 ans classé X';

    #[Groups(['read', 'movie:read', 'movie:description', 'movieShow:full'])]
    public function getValue(): string
    {
        return $this->value;
    }
}
