<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Movie;
use App\Repository\UserRepository;

/**
 * @implements ProviderInterface<Movie>
 */
class EmployeeListProvider implements ProviderInterface
{
    public function __construct(readonly private UserRepository $userRepository)
    {
    }

    /**
     * {@inheritdoc}
     *
     * @return Movie[]
     *
     * @throws \JsonException
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $employee = $this->userRepository->findByRole('ROLE_EMPLOYEE');
        $admin = $this->userRepository->findByRole('ROLE_ADMIN');

        return [...$employee, ...$admin];
    }
}
