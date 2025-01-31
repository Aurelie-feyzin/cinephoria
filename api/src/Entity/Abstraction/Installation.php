<?php
declare(strict_types=1);

namespace App\Entity\Abstraction;

use App\Entity\MovieTheater;
use App\Enum\InstallationStatus;
use App\Trait\IdTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\MappedSuperclass;
use Symfony\Component\Validator\Constraints as Assert;

#[MappedSuperclass]
abstract class Installation
{
    use IdTrait;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    protected ?string $name = null;

    #[ORM\Column(type: Types::STRING, nullable: false, enumType: InstallationStatus::class)]
    #[Assert\NotBlank]
    protected ?InstallationStatus $status = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    protected ?string $repairDetails = null;

    #[ORM\Column(nullable: true)]
    protected ?\DateTimeImmutable $lastMaintenanceDate = null;

    #[ORM\Column(nullable: true)]
    protected ?\DateTimeImmutable $lastRepairDate = null;

    #[ORM\ManyToOne()]
    #[Assert\NotBlank]
    protected ?MovieTheater $movieTheater = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getStatus(): ?InstallationStatus
    {
        return $this->status;
    }

    public function setStatus(InstallationStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getRepairDetails(): ?string
    {
        return $this->repairDetails;
    }

    public function setRepairDetails(?string $repairDetails): static
    {
        $this->repairDetails = $repairDetails;

        return $this;
    }

    public function getMovieTheater(): ?MovieTheater
    {
        return $this->movieTheater;
    }

    public function setMovieTheater(?MovieTheater $movieTheater): static
    {
        $this->movieTheater = $movieTheater;

        return $this;
    }

    public function getLastMaintenanceDate(): ?\DateTimeImmutable
    {
        return $this->lastMaintenanceDate;
    }

    public function setLastMaintenanceDate(?\DateTimeImmutable $lastMaintenanceDate): static
    {
        $this->lastMaintenanceDate = $lastMaintenanceDate;

        return $this;
    }

    public function getLastRepairDate(): ?\DateTimeImmutable
    {
        return $this->lastRepairDate;
    }

    public function setLastRepairDate(?\DateTimeImmutable $lastRepairDate): static
    {
        $this->lastRepairDate = $lastRepairDate;

        return $this;
    }
}
