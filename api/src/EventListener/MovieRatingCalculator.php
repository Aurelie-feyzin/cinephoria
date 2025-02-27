<?php
declare(strict_types=1);

namespace App\EventListener;

use App\Document\Review;
use App\Entity\Movie;
use App\Repository\ReviewRepository;
use Doctrine\Bundle\MongoDBBundle\Attribute\AsDocumentListener;
use Doctrine\ODM\MongoDB\Event\LifecycleEventArgs;
use Doctrine\ODM\MongoDB\Events;
use Doctrine\ORM\EntityManagerInterface;

#[AsDocumentListener(event: Events::postUpdate)]
#[AsDocumentListener(event: Events::postPersist)]
#[AsDocumentListener(event: Events::postRemove)]
class MovieRatingCalculator
{
    public function __construct(private readonly EntityManagerInterface $manager,
        private readonly ReviewRepository $reviewRepository)
    {
    }

    public function postPersist(LifecycleEventArgs $event): void
    {
        $this->calculateRating($event);
    }

    public function postUpdate(LifecycleEventArgs $event): void
    {
        $this->calculateRating($event);
    }

    public function preRemove(LifecycleEventArgs $event): void
    {
        $this->calculateRating($event);
    }

    private function calculateRating(LifecycleEventArgs $event): void
    {
        $entity = $event->getDocument();
        if (!$entity instanceof Review) {
            return;
        }
        $movieId = $entity->getReservation()->getMovieId();
        $average = $this->reviewRepository->calculRating($movieId);

        /** @var Movie $movie */
        $movie = $this->manager->getRepository(Movie::class)->find($movieId);
        if (!$movie instanceof Movie) {
            return;
        }
        $movie->setRating($average);
        $this->manager->persist($movie);
        $this->manager->flush();
    }
}
