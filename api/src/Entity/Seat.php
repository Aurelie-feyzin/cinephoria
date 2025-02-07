<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\Abstraction\Installation;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(paginationEnabled: false, normalizationContext: ['groups' => ['installationMinimal:read']]),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
    ],
    mercure: true)]
#[ApiFilter(SearchFilter::class, properties: ['movieTheater' => 'exact'])]
class Seat extends Installation
{
    #[ORM\Column(type: Types::BOOLEAN, nullable: false, options: ['default' => false])]
    #[Groups(['installationMinimal:read'])]
    private bool $reducedMobilitySeat = false;

    public function isReducedMobilitySeats(): bool
    {
        return $this->reducedMobilitySeat;
    }

    public function setReducedMobilitySeat(bool $reducedMobilitySeat): Seat
    {
        $this->reducedMobilitySeat = $reducedMobilitySeat;

        return $this;
    }
}
