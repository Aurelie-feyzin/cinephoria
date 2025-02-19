<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Document\Reservation;
use App\Entity\User;
use App\Repository\ReservationRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @implements ProviderInterface<Reservation>
 */
class UserReservationsProvider implements ProviderInterface
{
    public function __construct(private readonly ReservationRepository $reservationRepository,
        private readonly Security $security)
    {
    }

    /**
     * {@inheritdoc}
     *
     * @return Reservation[]
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (!$user instanceof UserInterface) {
            throw new UserNotFoundException('User not found');
        }

        $allReservation = $this->reservationRepository->findBy(['userId' => $user->getId()]);

        if (!array_key_exists('movieShowDate', $context['filters'])) {
            return $allReservation;
        }

        $filterDateString = $context['filters']['movieShowDate']['after'];
        $reservations = [];

        /** @var Reservation $reservation */
        foreach ($allReservation as $reservation) {
            if ($reservation->getMovieShowDate()->format('Y-m-d') >= $filterDateString) {
                $reservations[] = $reservation;
            }
        }

        return $reservations;
    }
}
