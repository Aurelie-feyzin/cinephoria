<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Document\Reservation;
use App\Entity\MovieShow;
use App\Entity\Seat;
use App\Entity\User;
use App\Exception\SeatQuantityExceededException;
use App\Repository\SeatRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;

/** @implements ProcessorInterface<Reservation, null> */
readonly class CreateReservationStateProcessor implements ProcessorInterface
{
    public function __construct(
        private DocumentManager $documentManager,
        private Security $security,
        private SeatRepository $seatRepository,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ?Reservation
    {
        $reservation = (new Reservation());
        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user instanceof UserInterface) {
            throw new UserNotFoundException('User not found');
        }
        // Transform the DTO into a MongoDB document (Reservation)
        /** @var MovieShow $movieShow */
        $movieShow = $data->getMovieShow();
        $movieTheater = $movieShow->getMovieTheater();
        $reservation
            ->setUserId($user->getId())
            ->setMovieId($movieShow->getMovie()->getId())
            ->setMovieName($movieShow->getMovie()->getTitle())
            ->setMovieBackdropPath($movieShow->getMovie()->getBackdropPath())
            ->setCinemaId($movieTheater->getCinema()->getId())
            ->setCinemaName($movieTheater->getCinema()->getName())
            ->setMovieShowId($movieShow->getId())
            ->setMovieShowDate($movieShow->getDate())
            ->setMovieShowStartTime($movieShow->getStartTime())
            ->setMovieShowEndTime($movieShow->getEndTime())
            ->setMovieTheaterId($movieTheater->getId())
            ->setMovieTheaterName($movieTheater->getTheaterName())
            ->setNumberOfSeats($data->getNumberOfSeats());

        $unassignedSeats = $data->getNumberOfSeats();

        $availableSeats = $this->seatRepository->findAvailableSeatsForMovieShow($movieShow->getId());

        if ($unassignedSeats > count($availableSeats)) {
            throw new SeatQuantityExceededException($unassignedSeats, count($availableSeats));
        }

        foreach ($data->getSeats() as $iValue) {
            $seat = $this->seatRepository->find($iValue);
            if ($seat && in_array($seat, $availableSeats, true)) {
                $reservation->addSeatId($seat->getId());
                $reservation->addSeatName($seat->getName());
                --$unassignedSeats;
            }
        }

        $this->addUnassignedSeats($unassignedSeats, $reservation, $availableSeats);

        $this->documentManager->persist($reservation);

        $this->documentManager->flush();  // Save to MongoDB

        // Return the saved document or DTO
        return $reservation;
    }

    /**
     * @param Seat[] $availableSeats
     */
    private function addUnassignedSeats(int $unassignedSeats, Reservation $reservation, array $availableSeats): void
    {
        if ($unassignedSeats > 0) {
            $nbAvailableSeats = count($availableSeats);
            for ($i = 0; $i < $unassignedSeats; ++$i) {
                $reservation->addSeatId($availableSeats[$nbAvailableSeats - 1 - $i]->getId());
                $reservation->addSeatName($availableSeats[$nbAvailableSeats - 1 - $i]->getName());
            }
        }
    }
}
