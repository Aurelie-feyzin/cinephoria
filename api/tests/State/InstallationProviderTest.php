<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Entity\Abstraction\Installation;
use App\Entity\ProjectionInstallation;
use App\Entity\Seat;
use App\State\InstallationProvider;
use Doctrine\ORM\EntityManager;
use Doctrine\Persistence\ObjectRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Uid\UuidV4;

class InstallationProviderTest extends TestCase
{
    /**
     * @dataProvider installationDataProvider
     */
    public function testInstallationProvider(?Seat $seat, ?ProjectionInstallation $projectionQuality, ?UuidV4 $uuid): void
    {
        $entityManager = $this->createMock(EntityManager::class);

        $projectionInstallationRepo = $this->createMock(ObjectRepository::class);
        $seatRepo = $this->createMock(ObjectRepository::class);

        $entityManager->method('getRepository')
            ->willReturnMap([
                [ProjectionInstallation::class, $projectionInstallationRepo],
                [Seat::class, $seatRepo],
            ]);

        if ($projectionQuality instanceof ProjectionInstallation) {
            $projectionInstallationRepo->method('find')
                ->with($uuid->toRfc4122())
                ->willReturn($projectionQuality);
        } else {
            $projectionInstallationRepo->method('find')
                ->with($uuid->toRfc4122())
                ->willReturn(null);
        }

        if ($seat instanceof Seat) {
            $seatRepo->method('find')
                ->with($uuid->toRfc4122())
                ->willReturn($seat);
        } else {
            $seatRepo->method('find')
            ->with($uuid->toRfc4122())
                ->willReturn(null);
        }

        $provider = new InstallationProvider($entityManager);

        $installation = $provider->provide($this->createMock(Operation::class), ['id' => $uuid->toRfc4122()], []);
        if ($installation instanceof Installation) {
            $this->assertSame($seat ?: $projectionQuality, $installation);
        } else {
            $this->assertNull($installation);
        }
    }

    /**
     * @return array<string, array{?Seat, ?ProjectionInstallation, UuidV4}>
     */
    public function installationDataProvider(): array
    {
        $seatId = new UuidV4();
        $seat = (new Seat())->setId($seatId);
        $projectionId = new UuidV4();
        $projection = (new ProjectionInstallation())->setId($projectionId);

        return [
            'seat' => [$seat, null, $seatId],
            'projection quality' => [null, $projection, $projectionId],
            'none' => [null, null, new UuidV4()],
        ];
    }
}
