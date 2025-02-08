<?php
declare(strict_types=1);

namespace App\Enum;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Trait\EnumTrait;

/** https://fr.wikipedia.org/wiki/Commission_de_classification_des_%C5%93uvres_cin%C3%A9matographiques
 * https://les-tilleuls.coop/blog/exposez-vos-enums-avec-api-platform.
 **/
#[ApiResource(
    description: 'Status used for an installation',
    types: ['https://schema.org/Enumeration'],
    normalizationContext: ['groups' => ['read']]
),
    GetCollection(provider: InstallationStatus::class.'::getCases'),
    Get(provider: InstallationStatus::class.'::getCase'),
]
enum InstallationStatus: string
{
    use EnumTrait;
    case AVAILABLE = 'disponible';
    case TO_REPAIR = 'a_reparer';
    case UNDER_REPAIR = 'en_reparation';
}
