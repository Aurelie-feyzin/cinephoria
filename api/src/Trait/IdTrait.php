<?php
declare(strict_types=1);

namespace App\Trait;

use ApiPlatform\Metadata\ApiProperty;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

trait IdTrait
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid')]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator('doctrine.uuid_generator')]
    #[ApiProperty(identifier: true)]
    protected ?Uuid $id = null;

    public function getId(): ?string
    {
        return (null === $this->id) ? null : $this->id->toRfc4122();
    }

    public function getUuid(): ?Uuid
    {
        return $this->id;
    }

    public function setId(?Uuid $uuid): self
    {
        $this->id = $uuid;

        return $this;
    }
}
