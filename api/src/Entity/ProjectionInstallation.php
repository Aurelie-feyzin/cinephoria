<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\Abstraction\Installation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
    ],
    mercure: true)]
class ProjectionInstallation extends Installation
{
    #[ORM\ManyToOne()]
    private ?ProjectionQuality $projectionQuality = null;

    public function getProjectionQuality(): ?ProjectionQuality
    {
        return $this->projectionQuality;
    }

    public function setProjectionQuality(?ProjectionQuality $projectionQuality): static
    {
        $this->projectionQuality = $projectionQuality;

        return $this;
    }
}
