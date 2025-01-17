<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Trait\IdTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(mercure: true)]
class MovieTheater
{
    use IdTrait;

    #[ORM\ManyToOne(targetEntity: Cinema::class, inversedBy: 'movieTheaters')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['movie:read'])]
    private ?Cinema $cinema = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull]
    #[Assert\GreaterThan(0)]
    private ?int $numberOfSeats = null;

    #[ORM\Column(type: Types::SMALLINT)]
    #[Assert\NotNull]
    #[Assert\GreaterThan(0)]
    private ?int $reducedMobilitySeats = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['movie:read'])]
    private ?string $theaterName = null;

    #[ORM\ManyToOne(targetEntity: ProjectionQuality::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['movie:read'])]
    private ?ProjectionQuality $projectionQuality = null;

    /**
     * @var Collection<int, MovieShow>
     */
    #[ORM\OneToMany(mappedBy: 'movieTheater', targetEntity: MovieShow::class)]
    private Collection $movieShows;

    public function __construct()
    {
        $this->movieShows = new ArrayCollection();
    }

    public function getCinema(): ?Cinema
    {
        return $this->cinema;
    }

    public function setCinema(?Cinema $cinema): static
    {
        $this->cinema = $cinema;

        return $this;
    }

    public function getNumberOfSeats(): ?int
    {
        return $this->numberOfSeats;
    }

    public function setNumberOfSeats(int $numberOfSeats): static
    {
        $this->numberOfSeats = $numberOfSeats;

        return $this;
    }

    public function getReducedMobilitySeats(): ?int
    {
        return $this->reducedMobilitySeats;
    }

    public function setReducedMobilitySeats(?int $reducedMobilitySeats): static
    {
        $this->reducedMobilitySeats = $reducedMobilitySeats;

        return $this;
    }

    public function getTheaterName(): ?string
    {
        return $this->theaterName;
    }

    public function setTheaterName(?string $theaterName): static
    {
        $this->theaterName = $theaterName;

        return $this;
    }

    public function getProjectionQuality(): ?ProjectionQuality
    {
        return $this->projectionQuality;
    }

    public function setProjectionQuality(?ProjectionQuality $projectionQuality): static
    {
        $this->projectionQuality = $projectionQuality;

        return $this;
    }

    /**
     * @return Collection<int, MovieShow>
     */
    public function getMovieShows(): Collection
    {
        return $this->movieShows;
    }

    /**
     * @param Collection<int, MovieShow> $movieShows
     */
    public function setMovieShows(Collection $movieShows): void
    {
        $this->movieShows = $movieShows;
    }
}
