<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\Trait\IdTrait;
use App\Enum\AgeRestriction;
use App\State\NewMovieListProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['movie:description']]),
        new GetCollection(order: ['releaseDate' => 'desc', 'title' => 'asc'], normalizationContext: ['groups' => ['movie:description', 'id']]),
        new GetCollection(uriTemplate: '/new_list/movies', normalizationContext: ['groups' => ['movie:description']], provider: NewMovieListProvider::class),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
    ],
    mercure: false
),
]
#[ApiFilter(DateFilter::class, properties: ['movieShows.date'])]
#[ApiFilter(SearchFilter::class, properties: ['movieShows.movieTheater.cinema' => 'exact', 'genres' => 'exact'])]
class Movie
{
    use IdTrait;

    #[ORM\Column(length: 255)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:read', 'movieShow:full'])]
    #[Assert\NotBlank]
    #[ApiFilter(SearchFilter::class, strategy: 'ipartial')]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private ?string $posterPath = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    public ?MediaObject $backdrop = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $backdropPath = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:read', 'movieShow:full'])]
    private ?int $duration = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: false, options: ['default' => false])]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private bool $favorite = false;

    #[ORM\Column(type: Types::FLOAT, nullable: false)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private ?float $rating = 0;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['movie:description'])]
    private ?\DateTimeImmutable $releaseDate = null;

    /**
     * @var Collection<int, MovieGenre>
     */
    #[ORM\ManyToMany(targetEntity: MovieGenre::class, inversedBy: 'movies')]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private Collection $genres;

    #[ORM\Column(type: Types::STRING, nullable: false, enumType: AgeRestriction::class)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private ?AgeRestriction $ageRestriction = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: false)]
    #[Groups(['movie:read', 'movie:description', 'movie:light', 'movieShow:full'])]
    private ?bool $warning = false;

    /**
     * @var Collection<int, MovieShow>
     */
    #[ORM\OneToMany(mappedBy: 'movie', targetEntity: MovieShow::class, fetch: 'EXTRA_LAZY')]
    #[Groups(['movie:read', 'movie:light'])]
    private Collection $movieShows;

    public function __construct()
    {
        $this->genres = new ArrayCollection();
        $this->movieShows = new ArrayCollection();
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

    public function getBackdrop(): ?MediaObject
    {
        return $this->backdrop;
    }

    public function setBackdrop(?MediaObject $backdrop): Movie
    {
        $this->backdrop = $backdrop;

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
        return round($this->rating, 1);
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

    public function getAgeRestriction(): ?AgeRestriction
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

    /**
     * @return Collection<int, MovieShow>
     */
    public function getMovieShows(): Collection
    {
        return $this->movieShows;
    }

    public function addMovieShow(MovieShow $movieShow): static
    {
        if (!$this->movieShows->contains($movieShow)) {
            $this->movieShows->add($movieShow);
        }

        return $this;
    }

    public function removeMovieShow(MovieShow $movieShow): static
    {
        $this->movieShows->removeElement($movieShow);

        return $this;
    }
}
