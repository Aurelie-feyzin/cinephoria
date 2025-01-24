<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\State\ByCinemaMovieListProvider;
use App\Trait\IdTrait;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['movieShow:read']]),
        new GetCollection(order: ['date' => 'desc', 'movieTheater.cinema' => 'asc', 'movieTheater.theaterName' => 'asc', 'startTime' => 'asc'], normalizationContext: ['groups' => ['movieShow:read']]),
        new GetCollection(uriTemplate: '/cinemas/{id}/movie_shows', normalizationContext: ['groups' => ['movieShow:full']], provider: ByCinemaMovieListProvider::class),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
    ],
    mercure: true)]
#[ApiFilter(DateFilter::class, properties: ['date'])]
#[ApiFilter(SearchFilter::class, properties: ['movieTheater.cinema' => 'exact', 'movie.genres' => 'exact'])]
class MovieShow
{
    use IdTrait;

    #[Groups(['movieShow:read'])]
    public function getId(): ?string
    {
        return (null === $this->id) ? null : $this->id->toRfc4122();
    }
    #[ORM\ManyToOne(targetEntity: MovieTheater::class, inversedBy: 'movieShows')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['movie:read', 'movieShow:read', 'movieShow:full'])]
    private ?MovieTheater $movieTheater = null;

    #[ORM\ManyToOne(targetEntity: Movie::class, inversedBy: 'movieShows')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['movieShow:read', 'movieShow:full'])]
    private ?Movie $movie = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotNull]
    #[Groups(['movie:read', 'movieShow:read', 'movieShow:full'])]
    #[ApiFilter(DateFilter::class)]
    private ?DateTimeImmutable $date = null;

    #[ORM\Column(length: 5)]
    #[Assert\NotNull]
    #[Assert\Time(withSeconds: false)]
    #[Groups(['movie:read', 'movieShow:read', 'movieShow:full'])]
    private ?string $startTime = null;

    #[ORM\Column(length: 5)]
    #[Assert\Time(withSeconds: false)]
    #[Groups(['movie:read', 'movieShow:read', 'movieShow:full'])]
    private ?string $endTime = null;

    #[ORM\Column(type: Types::SMALLINT, nullable: true)]
    #[Assert\GreaterThan(0)]
    private ?int $priceInCents = null;

    public function getMovieTheater(): ?MovieTheater
    {
        return $this->movieTheater;
    }

    public function setMovieTheater(?MovieTheater $movieTheater): static
    {
        $this->movieTheater = $movieTheater;

        return $this;
    }

    public function getMovie(): ?Movie
    {
        return $this->movie;
    }

    public function setMovie(?Movie $movie): static
    {
        $this->movie = $movie;

        return $this;
    }

    public function getDate(): ?DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getStartTime(): ?string
    {
        return $this->startTime;
    }

    public function setStartTime(string $startTime): static
    {
        $this->startTime = $startTime;

        return $this;
    }

    public function getEndTime(): ?string
    {
        return $this->endTime;
    }

    public function setEndTime(string $endTime): static
    {
        $this->endTime = $endTime;

        return $this;
    }

    /**
     * @throws \DateMalformedStringException
     */
    #[Assert\IsTrue(message: 'L\'heure de fin n\'est pas valide')]
    public function isValidEndTime(): bool
    {
        $startTime = $this->date->modify('+ 0 day '.$this->startTime);
        $duration = $this->movie->getDuration();
        $minimalEndTime = $startTime->modify('+'.$duration.' minutes');

        return $this->date->modify('+ 0 day '.$this->endTime) >= $minimalEndTime;
    }

    public function getPriceInCents(): ?int
    {
        return $this->priceInCents;
    }

    public function setPriceInCents(float $priceInEuros): static
    {
        $this->priceInCents = (int) round($priceInEuros * 100);

        return $this;
    }

    #[Groups(['movie:read', 'movieShow:read', 'movieShow:full'])]
    public function getPriceInEuros(): float
    {
        return ($this->priceInCents ?: $this->movieTheater->getProjectionQuality()->getSuggestedPrice()) / 100;
    }
}
