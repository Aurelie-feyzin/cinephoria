<?php
declare(strict_types=1);

namespace App\Tests\Repository;

use App\Entity\Movie;
use App\Entity\MovieShow;
use App\Entity\MovieTheater;
use App\Repository\MovieShowRepository;
use App\Tests\DataFixtures\CinemaTestFixtures;
use App\Tests\DataFixtures\MovieTestFixtures;
use App\Tests\DataFixtures\MovieTheatherTestFixtures;
use App\Tests\DataFixtures\UserTestFixtures;
use App\Tests\Utils\TestFixtureLoaderTrait;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MovieShowRepositoryTest extends KernelTestCase
{
    use TestFixtureLoaderTrait;

    private ?EntityManagerInterface $entityManager = null;
    private MovieShowRepository $repository;

    private ?Movie $movie;
    private ?MovieTheater $theater;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->entityManager = self::getContainer()->get(EntityManagerInterface::class);
        $this->repository = $this->entityManager->getRepository(MovieShow::class);

        $container = self::getContainer();
        $this->loadFixtures($this->entityManager, [
            new UserTestFixtures(),
            new CinemaTestFixtures(),
            new MovieTestFixtures(),
            new MovieTheatherTestFixtures(),
        ], $container);

        $this->movie = $this->executor->getReferenceRepository()->getReference('movie', Movie::class);
        $this->theater = $this->executor->getReferenceRepository()->getReference('theater', MovieTheater::class);
    }

    public function testFindConflictingShowReturnsConflict(): void
    {
        $show1 = (new MovieShow())
            ->setMovie($this->movie)
            ->setMovieTheater($this->theater)
            ->setDate(new DateTimeImmutable('2025-10-05'))
            ->setStartTime('18:00')
            ->setEndTime('20:00');

        $this->entityManager->persist($show1);
        $this->entityManager->flush();

        // Case: overlap with show1 (start 19h, end 21h)
        $conflicts = $this->repository->findConflictingShow([
            'movieTheater' => $this->theater,
            'date' => new DateTimeImmutable('2025-10-05'),
            'startTime' => '19:00',
            'endTime' => '21:00',
        ]);

        $this->assertCount(1, $conflicts);
        $this->assertSame($show1->getId(), $conflicts[0]->getId());
    }

    public function testFindConflictingShowReturnsEmptyWhenNoOverlap(): void
    {
        $show1 = (new MovieShow())
            ->setMovie($this->movie)
            ->setMovieTheater($this->theater)
            ->setDate(new DateTimeImmutable('2025-10-06'))
            ->setStartTime('14:00')
            ->setEndTime('16:00');

        $this->entityManager->persist($show1);
        $this->entityManager->flush();

        // Case: no overlap (17h → 19h)
        $conflicts = $this->repository->findConflictingShow([
            'movieTheater' => $this->theater,
            'date' => new DateTimeImmutable('2025-10-06'),
            'startTime' => new DateTimeImmutable('2025-10-06 17:00'),
            'endTime' => new DateTimeImmutable('2025-10-06 19:00'),
        ]);

        $this->assertCount(0, $conflicts);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->entityManager->close();
        $this->entityManager = null;
    }
}
