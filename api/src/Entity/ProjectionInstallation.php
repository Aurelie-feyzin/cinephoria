<?php
declare(strict_types=1);

namespace App\Entity;

use App\Entity\Abstraction\Installation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity()]
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
