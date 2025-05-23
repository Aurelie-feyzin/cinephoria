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
use App\Repository\MovieShowRepository;
use App\Trait\IdTrait;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MovieShowRepository::class)]
#[UniqueEntity(
    fields: ['movieTheater', 'date', 'startTime', 'endTime'],
    message: 'La séance rentre en conflit avec une autre séance',
    repositoryMethod: 'findConflictingShow',
    errorPath: 'movieTheater')]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['movieShow:read']]),
        new GetCollection(order: ['date' => 'desc', 'movieTheater.cinema' => 'asc', 'movieTheater.theaterName' => 'asc', 'startTime' => 'asc'], normalizationContext: ['groups' => ['movieShow:read']]),
        new Patch(security: "is_granted('ROLE_EMPLOYEE')"),
        new Post(security: "is_granted('ROLE_EMPLOYEE')"),
    ],
    mercure: false)]
#[ApiFilter(DateFilter::class, properties: ['date'])]
#[ApiFilter(SearchFilter::class, properties: ['movieTheater.cinema' => 'exact', 'movie.genres' => 'exact', 'movie' => 'exact'])]
class MovieShow
{
    use IdTrait;

    #[Groups(['movieShow:read', 'movieShow:full'])]
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
    #[Groups(['movie:read', 'movieShow:read', 'movieShow:full', 'movie:light'])]
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

    #[Groups(['movieShow:read', 'movieShow:full'])]
    private int $availableSeats = 0;

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

    #[Assert\IsTrue(message: 'L\'heure de fin n\'est pas valide')]
    public function isValidEndTime(): bool
    {
        if (!$this->date || !$this->startTime || !$this->endTime || !$this->movie || null === $this->movie->getDuration()) {
            return false;
        }

        try {
            $startTime = new DateTimeImmutable($this->date->format('Y-m-d').' '.$this->startTime);
            $minimalEndTime = $startTime->modify('+'.$this->movie->getDuration().' minutes');
            $endTime = new DateTimeImmutable($this->date->format('Y-m-d').' '.$this->endTime);
        } catch (\Exception) {
            return false;
        }

        return $endTime >= $minimalEndTime;
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

    public function getAvailableSeats(): int
    {
        return $this->availableSeats;
    }

    public function setAvailableSeats(int $availableSeats): MovieShow
    {
        $this->availableSeats = $availableSeats;

        return $this;
    }
}
