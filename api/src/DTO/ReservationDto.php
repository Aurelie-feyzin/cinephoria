<?php
declare(strict_types=1);

namespace App\DTO;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Document\Reservation;
use App\Entity\MovieShow;
use App\State\CreateReservationStateProcessor;

#[ApiResource(
    operations: [
        new Post(security: "is_granted('ROLE_USER')", output: Reservation::class, processor: CreateReservationStateProcessor::class),
    ],
    mercure: true)]
class ReservationDto
{
    private MovieShow $movieShow;

    private string $numberOfSeats;

    private string $mobilityReduced;

    /**
     * @var string[]
     */
    private array $seats = [];

    public function getMovieShow(): MovieShow
    {
        return $this->movieShow;
    }

    public function setMovieShow(MovieShow $movieShow): ReservationDto
    {
        $this->movieShow = $movieShow;

        return $this;
    }

    public function getNumberOfSeats(): string
    {
        return $this->numberOfSeats;
    }

    public function setNumberOfSeats(string $numberOfSeats): ReservationDto
    {
        $this->numberOfSeats = $numberOfSeats;

        return $this;
    }

    /**
     * @return string[]
     */
    public function getSeats(): array
    {
        return $this->seats;
    }

    public function addSeat(string $seat): ReservationDto
    {
        if (!in_array($seat, $this->seats)) {
            $this->seats[] = $seat;
        }

        return $this;
    }

    /*    public function removeSeat(string $seat): ReservationDto
        {
            $this->seats->removeElement($seat);

            return $this;
        }*/

    /**
     * @param string[] $seats
     *
     * @return $this
     */
    public function setSeats(array $seats): ReservationDto
    {
        $this->seats = $seats;

        return $this;
    }

    public function getMobilityReduced(): string
    {
        return $this->mobilityReduced;
    }

    public function setMobilityReduced(string $mobilityReduced): ReservationDto
    {
        $this->mobilityReduced = $mobilityReduced;

        return $this;
    }
}
