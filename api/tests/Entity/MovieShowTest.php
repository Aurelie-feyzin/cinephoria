<?php
declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Movie;
use App\Entity\MovieShow;
use App\Entity\MovieTheater;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\UuidV4;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class MovieShowTest extends KernelTestCase
{
    private ValidatorInterface $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = static::getContainer()->get(ValidatorInterface::class);
    }

    public function testDefaultAvailableSeatsIsZero(): void
    {
        $movieShow = new MovieShow();
        $this->assertSame(0, $movieShow->getAvailableSeats());
    }

    public function testValidMovieShow(): void
    {
        $movie = (new Movie())->setId(new UuidV4())->setDuration(90);
        $theater = (new MovieTheater())->setId(new UuidV4());

        $movieShow = (new MovieShow())
        ->setId(new UuidV4())
        ->setMovie($movie)
        ->setMovieTheater($theater)
        ->setDate(new \DateTimeImmutable('2025-04-04'))
        ->setStartTime('18:00')
        ->setEndTime('20:00')
        ->setPriceInCents(1000);

        $errors = $this->validator->validate($movieShow);
        $this->assertCount(0, $errors);
    }

    public function testInvalidTimeFormat(): void
    {
        $movieShow = new MovieShow();
        $movieShow->setStartTime('invalid');
        $movieShow->setEndTime('25:61'); // also invalid

        $errors = $this->validator->validate($movieShow);

        $this->assertGreaterThan(0, count($errors), 'Invalid time format should trigger validation errors');
    }

    public function testMissingRequiredFields(): void
    {
        $movieShow = new MovieShow(); // all required fields are missing

        $errors = $this->validator->validate($movieShow);

        $this->assertGreaterThanOrEqual(3, count($errors), 'Missing required fields should trigger validation');
    }

    public function testNegativePriceIsInvalid(): void
    {
        $movieShow = (new MovieShow())->setPriceInCents(-1);

        $errors = $this->validator->validate($movieShow);
        $this->assertGreaterThan(0, count($errors), 'Negative price should trigger validation error');
    }

    private function createValidMovieShow(
        string $startTime = '18:00',
        string $endTime = '20:00',
        int $duration = 120,
    ): MovieShow {
        $movie = new Movie();
        $movie->setDuration($duration); // en minutes

        $theater = new MovieTheater();

        $movieShow = new MovieShow();
        $movieShow->setMovie($movie);
        $movieShow->setMovieTheater($theater);
        $movieShow->setDate(new \DateTimeImmutable('2025-04-04'));
        $movieShow->setStartTime($startTime);
        $movieShow->setEndTime($endTime);

        return $movieShow;
    }

    public function testIsValidEndTimeReturnsTrueForCorrectDuration(): void
    {
        $movieShow = $this->createValidMovieShow();
        $this->assertTrue($movieShow->isValidEndTime());
    }

    public function testIsValidEndTimeReturnsFalseForTooShortEndTime(): void
    {
        $movieShow = $this->createValidMovieShow('18:00', '19:00');
        $this->assertFalse($movieShow->isValidEndTime());
    }

    public function testIsValidEndTimeAcceptsExactMinimalDuration(): void
    {
        $movieShow = $this->createValidMovieShow('18:00', '19:30', 90);
        $this->assertTrue($movieShow->isValidEndTime());
    }

    public function testIsValidEndTimeReturnsTrueWhenMissingMovie(): void
    {
        $movieShow = new MovieShow();
        $movieShow->setDate(new \DateTimeImmutable('2025-04-04'));
        $movieShow->setStartTime('18:00');
        $movieShow->setEndTime('20:00');

        $this->assertFalse($movieShow->isValidEndTime());
    }

    public function testIsValidEndTimeReturnsTrueWhenMovieDurationIsNull(): void
    {
        $movie = new Movie();

        $movieShow = new MovieShow();
        $movieShow->setMovie($movie);
        $movieShow->setDate(new \DateTimeImmutable('2025-04-04'));
        $movieShow->setStartTime('18:00');
        $movieShow->setEndTime('20:00');

        $this->assertFalse($movieShow->isValidEndTime());
    }

    public function testIsValidEndTimeReturnsFalseForMalformedTime(): void
    {
        $movieShow = $this->createValidMovieShow('badtime', 'endtime', 90);
        $this->assertFalse($movieShow->isValidEndTime());
    }
}
