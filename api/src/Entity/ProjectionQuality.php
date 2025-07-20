<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\IdTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(mercure: false)]
#[ORM\Entity]
class ProjectionQuality
{
    use IdTrait;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Groups(['movie:read', 'movieShow:read', 'movieShow:read', 'movieTheater:read', 'movieShow:full'])]
    private ?string $name = null;

    #[ORM\Column(length: 20)]
    private ?string $format = null;

    #[ORM\Column(length: 20)]
    private ?string $audioSystem = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull()]
    #[Assert\GreaterThan(0)]
    #[Groups(['movieTheater:read'])]
    private ?int $suggestedPrice = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getFormat(): ?string
    {
        return $this->format;
    }

    public function setFormat(string $format): static
    {
        $this->format = $format;

        return $this;
    }

    public function getAudioSystem(): ?string
    {
        return $this->audioSystem;
    }

    public function setAudioSystem(string $audioSystem): static
    {
        $this->audioSystem = $audioSystem;

        return $this;
    }

    public function getSuggestedPrice(): ?int
    {
        return $this->suggestedPrice;
    }

    public function setSuggestedPrice(int $suggestedPrice): static
    {
        $this->suggestedPrice = $suggestedPrice;

        return $this;
    }
}
