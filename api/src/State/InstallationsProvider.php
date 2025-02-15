<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Abstraction\Installation;
use App\Entity\ProjectionInstallation;
use App\Entity\Seat;
use App\Enum\InstallationStatus;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProviderInterface<Installation>
 */
class InstallationsProvider implements ProviderInterface
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $findBy = [
            'status' => [InstallationStatus::TO_REPAIR, InstallationStatus::UNDER_REPAIR],
        ];

        $projectionInstallations = $this->entityManager->getRepository(ProjectionInstallation::class)->findBy($findBy);
        $seats = $this->entityManager->getRepository(Seat::class)->findBy($findBy);

        return [...$projectionInstallations, ...$seats];
    }
}
