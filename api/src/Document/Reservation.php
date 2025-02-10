<?php
declare(strict_types=1);

namespace App\Document;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\UserReservationsProvider;
use DateTimeImmutable;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Validator\Constraints as Assert;

// https://api-platform.com/docs/v3.2/core/mongodb/
// https://blog.eleven-labs.com/fr/symfony-et-mongodb-retour-aux-sources/
// https://www.mongodb.com/developer/products/mongodb/building-rest-api-with-mongodb-and-php/
#[ApiResource(
    operations: [
        new GetCollection(uriTemplate: '/user/reservations', security: "is_granted('ROLE_USER')", provider: UserReservationsProvider::class),
    ],
    mercure: true)]
#[ODM\Document(collection: 'reservations')]
class Reservation
{
    #[ODM\Id()]
    private ?string $id;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $userId;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $movieId;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $movieName;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $movieBackdropPath;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $cinemaId;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $cinemaName;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $movieShowId;

    #[ODM\Field]
    #[Assert\NotBlank]
    #[Assert\Date]
    private DateTimeImmutable $movieShowDate;

    #[ODM\Field]
    #[Assert\NotBlank]
    #[Assert\Time]
    private string $movieShowStartTime;

    #[ODM\Field]
    #[Assert\NotBlank]
    #[Assert\Time]
    private string $movieShowEndTime;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $movieTheaterId;

    #[ODM\Field]
    #[Assert\NotBlank]
    private string $movieTheaterName;

    #[ODM\Field]
    #[Assert\NotBlank]
    private int $numberOfSeats = 0;

    /**
     * @var string[]
     */
    #[ODM\Field(type: 'collection')]
    private array $seatIds = [];

    /**
     * @var string[]
     */
    #[ODM\Field(type: 'collection')]
    private array $seatNames = [];

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): void
    {
        $this->id = $id;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function setUserId(string $userId): Reservation
    {
        $this->userId = $userId;

        return $this;
    }

    public function getMovieId(): string
    {
        return $this->movieId;
    }

    public function setMovieId(string $movieId): Reservation
    {
        $this->movieId = $movieId;

        return $this;
    }

    public function getMovieName(): string
    {
        return $this->movieName;
    }

    public function setMovieName(string $movieName): Reservation
    {
        $this->movieName = $movieName;

        return $this;
    }

    public function getMovieBackdropPath(): string
    {
        return $this->movieBackdropPath;
    }

    public function setMovieBackdropPath(string $movieBackdropPath): Reservation
    {
        $this->movieBackdropPath = $movieBackdropPath;
        return $this;
    }

    public function getCinemaId(): string
    {
        return $this->cinemaId;
    }

    public function setCinemaId(string $cinemaId): Reservation
    {
        $this->cinemaId = $cinemaId;

        return $this;
    }

    public function getCinemaName(): string
    {
        return $this->cinemaName;
    }

    public function setCinemaName(string $cinemaName): Reservation
    {
        $this->cinemaName = $cinemaName;

        return $this;
    }

    public function getMovieShowId(): string
    {
        return $this->movieShowId;
    }

    public function setMovieShowId(string $movieShowId): Reservation
    {
        $this->movieShowId = $movieShowId;

        return $this;
    }

    public function getMovieShowDate(): DateTimeImmutable
    {
        return $this->movieShowDate;
    }

    public function getMovieShowStartTime(): string
    {
        return $this->movieShowStartTime;
    }

    public function setMovieShowStartTime(string $movieShowStartTime): Reservation
    {
        $this->movieShowStartTime = $movieShowStartTime;

        return $this;
    }

    public function getMovieShowEndTime(): string
    {
        return $this->movieShowEndTime;
    }

    public function setMovieShowEndTime(string $movieShowEndTime): Reservation
    {
        $this->movieShowEndTime = $movieShowEndTime;

        return $this;
    }

    public function setMovieShowDate(DateTimeImmutable $movieShowDate): Reservation
    {
        $this->movieShowDate = $movieShowDate;

        return $this;
    }

    public function getMovieTheaterId(): string
    {
        return $this->movieTheaterId;
    }

    public function setMovieTheaterId(string $movieTheaterId): Reservation
    {
        $this->movieTheaterId = $movieTheaterId;

        return $this;
    }

    public function getMovieTheaterName(): string
    {
        return $this->movieTheaterName;
    }

    public function setMovieTheaterName(string $movieTheaterName): Reservation
    {
        $this->movieTheaterName = $movieTheaterName;

        return $this;
    }

    public function getNumberOfSeats(): int
    {
        return $this->numberOfSeats;
    }

    public function setNumberOfSeats(int $numberOfSeats): Reservation
    {
        $this->numberOfSeats = $numberOfSeats;

        return $this;
    }

    /**
     * @return string[]
     */
    public function getSeatIds(): array
    {
        return $this->seatIds;
    }

    /**
     * @param string[] $seats
     */
    public function setSeatIds(array $seats): Reservation
    {
        $this->seatIds = $seats;

        return $this;
    }

    public function addSeatId(string $seatId): self
    {
        if (!in_array($seatId, $this->seatIds, true)) {
            $this->seatIds[] = $seatId;
        }

        return $this;
    }

    public function removeSeatId(string $seatId): self
    {
        $key = array_search($seatId, $this->seatIds);
        if (false !== $key) {
            unset($this->seatIds[$key]);

            // Reindex array
            $this->seatIds = array_values($this->seatIds);
        }

        return $this;
    }

    /**
     * @return string[]
     */
    public function getSeatNames(): array
    {
        return $this->seatNames;
    }

    /**
     * @param string[] $seatNames
     *
     * @return $this
     */
    public function setSeatNames(array $seatNames): Reservation
    {
        $this->seatNames = $seatNames;

        return $this;
    }

    public function addSeatName(string $seatName): self
    {
        if (!in_array($seatName, $this->seatNames, true)) {
            $this->seatNames[] = $seatName;
        }

        return $this;
    }
}
