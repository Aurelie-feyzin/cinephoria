<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Trait\IdTrait;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(mercure: true)]
#[ApiFilter(DateFilter::class, properties: ['date'])]
#[ApiFilter(SearchFilter::class, properties: ['movieTheater.cinema' => 'exact', 'movie.genres' => 'exact'])]
class MovieShow
{
    use IdTrait;
    #[ORM\ManyToOne(targetEntity: MovieTheater::class, inversedBy: 'movieShows')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['movie:read'])]
    private ?MovieTheater $movieTheater = null;

    #[ORM\ManyToOne(targetEntity: Movie::class, inversedBy: 'movieShows')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    private ?Movie $movie = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotNull]
    #[Groups(['movie:read'])]
    #[ApiFilter(DateFilter::class)]
    private ?DateTimeImmutable $date = null;

    #[ORM\Column(length: 5)]
    #[Assert\NotNull]
    #[Assert\Time(withSeconds: false)]
    #[Groups(['movie:read'])]
    private ?string $startTime = null;

    #[ORM\Column(length: 5)]
    #[Assert\Time(withSeconds: false)]
    #[Groups(['movie:read'])]
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

    public function getPriceInCents(): ?int
    {
        return $this->priceInCents;
    }

    public function setPriceInCents(float $priceInEuros): static
    {
        $this->priceInCents = (int) round($priceInEuros * 100);

        return $this;
    }

    #[Groups(['movie:read'])]
    public function getPriceInEuros(): float
    {
        return ($this->priceInCents ?: $this->movieTheater->getProjectionQuality()->getSuggestedPrice()) / 100;
    }
}
