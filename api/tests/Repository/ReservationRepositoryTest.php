<?php
declare(strict_types=1);

namespace App\Tests\Repository;

use App\Document\Reservation;
use App\Repository\ReservationRepository;
use DateTimeImmutable;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ReservationRepositoryTest extends KernelTestCase
{
    private ?DocumentManager $documentManager = null;
    private ReservationRepository $repository;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->documentManager = self::getContainer()->get(DocumentManager::class);
        $this->repository = $this->documentManager->getRepository(Reservation::class);

        $this->documentManager->createQueryBuilder(Reservation::class)
            ->remove()
            ->getQuery()
            ->execute();
    }

    public function testFindReservedSeatsForMovieShow(): void
    {
        $movieShowId = 'movieShow123';

        $reservation = (new Reservation())
            ->setMovieShowId($movieShowId)
            ->setSeatIds(['A1', 'A2']);

        $this->documentManager->persist($reservation);
        $this->documentManager->flush();

        $result = $this->repository->findReservedSeatsForMovieShow($movieShowId);

        $this->assertSame(['A1', 'A2'], $result);
    }

    public function testCountReservedSeatsForMovieShow(): void
    {
        $movieShowId = 'movieShow456';

        $reservation1 = (new Reservation())->setMovieShowId($movieShowId)->setSeatIds(['B1']);
        $reservation2 = (new Reservation())->setMovieShowId($movieShowId)->setSeatIds(['B2', 'B3']);

        $this->documentManager->persist($reservation1);
        $this->documentManager->persist($reservation2);
        $this->documentManager->flush();

        $count = $this->repository->countReservedSeatsForMovieShow($movieShowId);

        $this->assertSame(2, $count); // 2 documents Reservation, pas le total des sièges
    }

    public function testGetReservationsGroupedBy(): void
    {
        $startDate = new DateTimeImmutable('2025-10-01');
        $endDate = new DateTimeImmutable('2025-10-31');

        $r1 = (new Reservation())
            ->setMovieShowId('show1')
            ->setMovieShowDate(new DateTimeImmutable('2025-10-10'))
            ->setUserId('user1');

        $r2 = (new Reservation())
            ->setMovieShowId('show2')
            ->setMovieShowDate(new DateTimeImmutable('2025-10-15'))
            ->setUserId('user1');

        $r3 = (new Reservation())
            ->setMovieShowId('show3')
            ->setMovieShowDate(new DateTimeImmutable('2025-10-20'))
            ->setUserId('user2');

        $this->documentManager->persist($r1);
        $this->documentManager->persist($r2);
        $this->documentManager->persist($r3);
        $this->documentManager->flush();

        $result = $this->repository->getReservationsGroupedBy('userId', $startDate, $endDate);

        $this->assertSame(['user1' => 2, 'user2' => 1], $result);
    }

    public function testFindFuturReservationForUser(): void
    {
        $userId = 'user123';
        $today = new DateTimeImmutable('2025-10-05');

        $past = (new Reservation())
            ->setUserId($userId)
            ->setMovieShowId('old')
            ->setMovieShowDate(new DateTimeImmutable('2025-10-01'));

        $future = (new Reservation())
            ->setUserId($userId)
            ->setMovieShowId('new')
            ->setMovieShowDate(new DateTimeImmutable('2025-10-10'));

        $this->documentManager->persist($past);
        $this->documentManager->persist($future);
        $this->documentManager->flush();

        $results = $this->repository->findFuturReservationForUser($userId, $today);

        $this->assertCount(1, $results);
        $this->assertSame('new', $results[0]->getMovieShowId());
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->documentManager->close();
        $this->documentManager = null;
    }
}
