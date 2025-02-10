<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Document\Reservation;
use App\DTO\ReservationDto;
use App\Entity\MovieShow;
use App\Entity\User;
use App\Repository\SeatRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;

/** @implements ProcessorInterface<Reservation, null> */
class CreateReservationStateProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly DocumentManager $documentManager,
        private readonly Security $security,
        private readonly SeatRepository $seatRepository,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ?Reservation
    {
        // @phpstan-ignore-next-line
        if ($data instanceof ReservationDto) {
            $reservation = (new Reservation());
            try {
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
                    ->setNumberOfSeats((int) $data->getNumberOfSeats());

                $unassignedSeats = (int) $data->getNumberOfSeats();

                $designedSeats = count($data->getSeats());
                if ($designedSeats > 0 && $designedSeats > $data->getNumberOfSeats()) {
                    $designedSeats = $data->getNumberOfSeats();
                }
                for ($i = 0; $i < $designedSeats; ++$i) {
                    $seat = $this->seatRepository->find($data->getSeats()[$i]);
                    if ($seat) {
                        $reservation->addSeatId($seat->getId());
                        $reservation->addSeatName($seat->getName());
                        --$unassignedSeats;
                    }
                }

                $this->addUnassignedSeats($unassignedSeats, $reservation, $movieShow->getId());

                $this->documentManager->persist($reservation);

                $this->documentManager->flush();  // Save to MongoDB
            } catch (\Exception $e) {
                dump($e->getMessage());
            }

            // Return the saved document or DTO
            return $reservation;
        }

        return $data;
    }

    private function addUnassignedSeats(int $unassignedSeats, Reservation $reservation, string $movieShowId): void
    {
        if ($unassignedSeats > 0) {
            $availableSeats = $this->seatRepository->findAvailableSeatsForMovieShow($movieShowId);
            $nbAvailableSeats = count($availableSeats);
            for ($i = 0; $i < $unassignedSeats; ++$i) {
                $reservation->addSeatId($availableSeats[$nbAvailableSeats - 1 - $i]->getId());
                $reservation->addSeatName($availableSeats[$nbAvailableSeats - 1 - $i]->getName());
            }
        }
    }
}
