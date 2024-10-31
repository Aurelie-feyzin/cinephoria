<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Enum\AgeRestriction;
use App\State\NewMovieListProvider;
use App\Trait\IdTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new GetCollection(uriTemplate: '/movie/new_list', normalizationContext: ['groups' => ['movie:read']], provider: NewMovieListProvider::class),
    ],
    mercure: true
),
]
class Movie
{
    use IdTrait;

    #[ORM\Column(length: 255)]
    #[Groups(['movie:read'])]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['movie:read'])]
    private ?string $posterPath = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $backdropPath = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Groups(['movie:read'])]
    private ?int $duration = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['movie:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: false, options: ['default' => false])]
    private bool $favorite = false;

    #[ORM\Column(type: Types::FLOAT, nullable: false)]
    private ?float $rating = 0;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $releaseDate = null;

    /**
     * @var Collection<int, MovieGenre>
     */
    #[ORM\ManyToMany(targetEntity: MovieGenre::class, inversedBy: 'movies')]
    #[Groups(['movie:read'])]
    private Collection $genres;

    #[ORM\Column(type: Types::STRING, nullable: false, enumType: AgeRestriction::class)]
    #[Groups(['movie:read'])]
    private AgeRestriction $ageRestriction;

    #[ORM\Column(type: Types::BOOLEAN, nullable: false)]
    #[Groups(['movie:read'])]
    private ?bool $warning = null;

    public function __construct()
    {
        $this->genres = new ArrayCollection();
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getPosterPath(): ?string
    {
        return $this->posterPath;
    }

    public function setPosterPath(?string $posterPath): static
    {
        $this->posterPath = $posterPath;

        return $this;
    }

    public function getBackdropPath(): ?string
    {
        return $this->backdropPath;
    }

    public function setBackdropPath(?string $backdropPath): static
    {
        $this->backdropPath = $backdropPath;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function isFavorite(): bool
    {
        return $this->favorite;
    }

    public function setFavorite(bool $favorite): static
    {
        $this->favorite = $favorite;

        return $this;
    }

    public function getRating(): ?float
    {
        return $this->rating;
    }

    public function setRating(float $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getReleaseDate(): ?\DateTimeImmutable
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(\DateTimeImmutable $releaseDate): static
    {
        $this->releaseDate = $releaseDate;

        return $this;
    }

    /**
     * @return Collection<int, MovieGenre>
     */
    public function getGenres(): Collection
    {
        return $this->genres;
    }

    public function addGenre(MovieGenre $genre): static
    {
        if (!$this->genres->contains($genre)) {
            $this->genres->add($genre);
        }

        return $this;
    }

    public function removeGenre(MovieGenre $genre): static
    {
        $this->genres->removeElement($genre);

        return $this;
    }

    public function getAgeRestriction(): AgeRestriction
    {
        return $this->ageRestriction;
    }

    public function setAgeRestriction(AgeRestriction $ageRestriction): static
    {
        $this->ageRestriction = $ageRestriction;

        return $this;
    }

    public function isWarning(): ?bool
    {
        return $this->warning;
    }

    public function setWarning(bool $warning): static
    {
        $this->warning = $warning;

        return $this;
    }
}
