<?php
declare(strict_types=1);

namespace App\Entity\Abstraction;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\MovieTheater;
use App\Enum\InstallationStatus;
use App\State\InstallationProvider;
use App\State\InstallationsProvider;
use App\Trait\IdTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\MappedSuperclass;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[MappedSuperclass]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['installation:full']], security: "is_granted('ROLE_EMPLOYEE')", provider: InstallationProvider::class),
        new GetCollection(uriTemplate: '/out_of_service/installations', normalizationContext: ['groups' => ['installation:read']], provider: InstallationsProvider::class),
        new GetCollection(normalizationContext: ['groups' => ['installation:read']], provider: InstallationsProvider::class),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
    ],
    mercure: true)]
#[ApiFilter(SearchFilter::class, properties: ['movieTheater' => 'exact', 'status' => 'exact'])]
abstract class Installation
{
    use IdTrait;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Groups(['installationMinimal:read', 'installation:read', 'installation:input', 'installation:full'])]
    protected ?string $name = null;

    #[ORM\Column(type: Types::STRING, nullable: false, enumType: InstallationStatus::class)]
    #[Assert\NotBlank]
    #[Groups(['installation:read', 'installation:input', 'installation:full'])]
    protected ?InstallationStatus $status = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['installation:input', 'installation:full'])]
    protected ?string $repairDetails = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['installation:input', 'installation:full'])]
    protected ?\DateTimeImmutable $lastMaintenanceDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['installation:input', 'installation:full'])]
    protected ?\DateTimeImmutable $lastRepairDate = null;

    #[ORM\ManyToOne(targetEntity: MovieTheater::class)]
    #[Assert\NotBlank]
    #[Groups(['installation:read', 'installation:input', 'installation:full'])]
    protected ?MovieTheater $movieTheater = null;

    #[Groups(['installationMinimal:read', 'installation:full', 'installation:read'])]
    public function getId(): ?string
    {
        return (null === $this->id) ? null : $this->id->toRfc4122();
    }

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
