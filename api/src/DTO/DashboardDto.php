<?php
declare(strict_types=1);

namespace App\DTO;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\DashboardStateProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/dashboard/{id}',
            security: "is_granted('ROLE_ADMIN')",
            read: null,
            write: false,
            provider: DashboardStateProvider::class,
        ),
    ],
    mercure: true)]
class DashboardDto
{
    #[ApiProperty(identifier: true)]
    private string $id = 'dashboard';

    /**
     * @var array<string, number>
     */
    private array $reservationsByMovie;
    /**
     * @var array<string, number>
     */
    private array $reservationsByCinema;
    /**
     * @var array<string, number>
     */
    private array $reservationsByDay;

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): DashboardDto
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return array<string, number>
     */
    public function getReservationsByMovie(): array
    {
        return $this->reservationsByMovie;
    }

    /**
     * @param array<string, number> $reservationsByMovie
     *
     * @return $this
     */
    public function setReservationsByMovie(array $reservationsByMovie): DashboardDto
    {
        $this->reservationsByMovie = $reservationsByMovie;

        return $this;
    }

    /**
     * @return array<string, number>
     */
    public function getReservationsByCinema(): array
    {
        return $this->reservationsByCinema;
    }

    /**
     * @param array<string, number> $reservationsByCinema
     *
     * @return $this
     */
    public function setReservationsByCinema(array $reservationsByCinema): DashboardDto
    {
        $this->reservationsByCinema = $reservationsByCinema;

        return $this;
    }

    /**
     * @return array<string, number>
     */
    public function getReservationsByDay(): array
    {
        return $this->reservationsByDay;
    }

    /**
     * @param array<string, number> $reservationsByDay
     *
     * @return $this
     */
    public function setReservationsByDay(array $reservationsByDay): DashboardDto
    {
        $this->reservationsByDay = $reservationsByDay;

        return $this;
    }
}
