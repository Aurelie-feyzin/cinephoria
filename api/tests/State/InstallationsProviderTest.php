<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Entity\Abstraction\Installation;
use App\Entity\ProjectionInstallation;
use App\Entity\Seat;
use App\Enum\InstallationStatus;
use App\State\InstallationsProvider;
use Doctrine\ORM\EntityManager;
use Doctrine\Persistence\ObjectRepository;
use PHPUnit\Framework\TestCase;

class InstallationsProviderTest extends TestCase
{
    /**
     * @param Seat[]                   $seats
     * @param ProjectionInstallation[] $projections
     * @param Installation[]           $expectedInstallations
     *
     * @dataProvider installationListProvider
     */
    public function testInstallationProvider(array $seats, array $projections, array $expectedInstallations): void
    {
        $entityManager = $this->createMock(EntityManager::class);

        $projectionInstallationRepo = $this->createMock(ObjectRepository::class);
        $seatRepo = $this->createMock(ObjectRepository::class);

        $entityManager->method('getRepository')
            ->willReturnMap([
                [ProjectionInstallation::class, $projectionInstallationRepo],
                [Seat::class, $seatRepo],
            ]);

        if (count($seats) > 0) {
            $seatRepo->method('findBy')
                ->with(['status' => [InstallationStatus::TO_REPAIR, InstallationStatus::UNDER_REPAIR]])
                ->willReturn($seats);
        } else {
            $seatRepo->method('findBy')
                ->with(['status' => [InstallationStatus::TO_REPAIR, InstallationStatus::UNDER_REPAIR]])
                ->willReturn([]);
        }

        if (count($projections) > 0) {
            $projectionInstallationRepo->method('findBy')
                ->with(['status' => [InstallationStatus::TO_REPAIR, InstallationStatus::UNDER_REPAIR]])
                ->willReturn($projections);
        } else {
            $projectionInstallationRepo->method('findBy')
                ->with(['status' => [InstallationStatus::TO_REPAIR, InstallationStatus::UNDER_REPAIR]])
                ->willReturn([]);
        }

        $provider = new InstallationsProvider($entityManager);
        $installations = $provider->provide($this->createMock(Operation::class), [], []);
        $this->assertCount(count($expectedInstallations), $installations);
        sort($installations);
        sort($expectedInstallations);
        $this->assertSame($expectedInstallations, $installations);
    }

    /**
     * @return array<string, array{Seat[], ProjectionInstallation[], Installation[]}>
     */
    public function installationListProvider(): array
    {
        $seat = new Seat();
        $seat2 = new Seat();
        $projection = new ProjectionInstallation();
        $projection2 = new ProjectionInstallation();

        return [
            'seat and projection' => [[$seat], [$projection], [$projection, $seat]],
            'only seat' => [[$seat], [], [$seat]],
            'only projection' => [[], [$projection], [$projection]],
            'empty installation' => [[], [], []],
            'seats ' => [[$seat, $seat2], [], [$seat, $seat2]],
            'projections ' => [[], [$projection, $projection2], [$projection, $projection2]],
            'seats and projections' => [[$seat, $seat2], [$projection, $projection2], [$projection, $projection2, $seat, $seat2]],
        ];
    }
}
