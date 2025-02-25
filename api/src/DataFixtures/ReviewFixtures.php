<?php
declare(strict_types=1);

namespace App\DataFixtures;

use App\Document\Reservation;
use App\Document\Review;
use App\Enum\ReviewStatus;
use DateTime;
use Doctrine\Bundle\MongoDBBundle\Fixture\ODMFixtureInterface;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

/** @SuppressWarnings(PHPMD.StaticAccess) */
class ReviewFixtures implements ODMFixtureInterface, DependentFixtureInterface
{
    public function __construct(
        private readonly DocumentManager $documentManager,
    ) {
    }

    public function getDependencies(): array
    {
        return [
            ReservationFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-FR');
        $now = (new DateTime())->format('Y-m-d');
        $criteria = Criteria::create()
            ->andWhere(Criteria::expr()->lt('movieShowDate', $now));
        $reservationRepo = $this->documentManager->getRepository(Reservation::class);
        $passedReservations = $reservationRepo->matching($criteria);
        foreach ($passedReservations as $reservation) {
            if ($faker->boolean(75)) {
                $review = (new Review())
                    ->setStatus($faker->boolean(10) ? ReviewStatus::REJECTED :
                        ($faker->boolean() ? ReviewStatus::SUBMITTED : $faker->randomElement(ReviewStatus::class)))
                    ->setComment($faker->realTextBetween())
                    ->setRating($faker->numberBetween(0, 5))
                    ->setReservation($reservation)
                ;
                $manager->persist($review);
            }
        }
        $manager->flush();
    }
}
