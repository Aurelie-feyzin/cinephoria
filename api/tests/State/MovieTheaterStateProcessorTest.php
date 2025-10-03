<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\MovieTheater;
use App\Entity\Seat;
use App\Exception\MovieTheaterValidationException;
use App\State\MovieTheaterStateProcessor;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

final class MovieTheaterStateProcessorTest extends TestCase
{
    private EntityManagerInterface&MockObject $entityManager;

    /**
     * @var ProcessorInterface<object, object|null>&MockObject
     */
    private ProcessorInterface&MockObject $innerProcessor;
    private MovieTheaterStateProcessor $processor;
    private Operation&MockObject $operation;

    protected function setUp(): void
    {
        $this->innerProcessor = $this->createMock(ProcessorInterface::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->processor = new MovieTheaterStateProcessor($this->innerProcessor, $this->entityManager);
        $this->operation = $this->createMock(Operation::class);
    }

    public function testProcessPersistsSeatsAndCallsInnerProcessor(): void
    {
        $theater = new MovieTheater();
        $theater->setNumberOfSeats(5);
        $theater->setReducedMobilitySeats(2);

        $this->entityManager->expects($this->exactly(5))
            ->method('persist')
            ->with($this->isInstanceOf(Seat::class));

        $this->entityManager->expects($this->once())
            ->method('flush');

        $this->innerProcessor->expects($this->once())
            ->method('process')
            ->with($theater, $this->operation, [], []);

        $result = $this->processor->process($theater, $this->operation);

        $this->assertSame($theater, $result);
    }

    public function testProcessThrowsValidationExceptionIfNumberOfSeatsChanged(): void
    {
        $old = new MovieTheater();
        $old->setNumberOfSeats(50)->setReducedMobilitySeats(2);

        $new = new MovieTheater();
        $new->setNumberOfSeats(25)->setReducedMobilitySeats(2);

        $this->expectException(MovieTheaterValidationException::class);
        $this->expectExceptionMessage('Impossible de modifier le nombre de place');

        $this->processor->process($new, $this->operation, [], ['previous_data' => $old]);
    }

    public function testProcessThrowsValidationExceptionIfReducedMobilityChanged(): void
    {
        $old = new MovieTheater();
        $old->setNumberOfSeats(50)->setReducedMobilitySeats(10);

        $new = new MovieTheater();
        $new->setNumberOfSeats(50)->setReducedMobilitySeats(5);

        $this->expectException(MovieTheaterValidationException::class);
        $this->expectExceptionMessage('Impossible de modifier le nombre de place à mobilité réduite');

        $this->processor->process($new, $this->operation, [], ['previous_data' => $old]);
    }
}
