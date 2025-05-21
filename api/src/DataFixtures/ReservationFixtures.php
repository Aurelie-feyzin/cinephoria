<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\Document\Reservation;
use App\Entity\MovieShow;
use App\Repository\SeatRepository;
use App\Repository\UserRepository;
use Doctrine\Bundle\MongoDBBundle\Fixture\ODMFixtureInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;

/** @SuppressWarnings(PHPMD.StaticAccess) */
class ReservationFixtures implements ODMFixtureInterface
{
    public function __construct(
        private readonly SeatRepository $seatRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-FR');
        $basicUsers = $this->userRepository->findByRole('ROLE_USER');
        $allMovieShows = $this->entityManager->getRepository(MovieShow::class)->findAll();

        foreach ($basicUsers as $user) {
            $nbReservations = 'user@test.fr' === $user->getEmail() ? 8 : $faker->numberBetween(0, 10);
            for ($i = 0; $i < $nbReservations; ++$i) {
                $movieShow = $this->getRandomMovieShow($allMovieShows, $faker);
                $movieTheater = $movieShow->getMovieTheater();
                $numberOfSeats = $faker->numberBetween(1, 5);
                $reservation = (new Reservation())
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
                    ->setNumberOfSeats($numberOfSeats)
                ;

                $this->addUnassignedSeats($numberOfSeats, $reservation, $movieShow->getId());

                $manager->persist($reservation);
            }
        }
        $manager->flush();
    }

    private function addUnassignedSeats(int $unassignedSeats, Reservation $reservation, string $movieShowId): void
    {
        $availableSeats = $this->seatRepository->findAvailableSeatsForMovieShow($movieShowId);
        $nbAvailableSeats = count($availableSeats);
        for ($i = 0; $i < $unassignedSeats; ++$i) {
            $reservation->addSeatName($availableSeats[$nbAvailableSeats - 1 - $i]->getName());
            $reservation->addSeatId($availableSeats[$nbAvailableSeats - 1 - $i]->getId());
        }
    }

    /**
     * @param MovieShow[] $allMovieShow
     */
    private function getRandomMovieShow(array $allMovieShow, Generator $faker): MovieShow
    {
        $hasAvailableSeats = function ($movieShow) {
            return $this->seatRepository->countAvailableSeatsForMovieShow($movieShow->getId()) > 5;
        };

        /* @var MovieShow $movieShow */
        return $faker->valid($hasAvailableSeats)->randomElement($allMovieShow);
    }
}
