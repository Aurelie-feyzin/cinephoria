<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Abstraction\Installation;
use App\Entity\ProjectionInstallation;
use App\Entity\Seat;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProviderInterface<Installation>
 */
class InstallationProvider implements ProviderInterface
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?Installation
    {
        $id = $uriVariables['id'];

        $installation = $this->entityManager->getRepository(ProjectionInstallation::class)->find($id);
        if (!$installation instanceof ProjectionInstallation) {
            $installation = $this->entityManager->getRepository(Seat::class)->find($id);
        }

        return $installation;
    }
}
