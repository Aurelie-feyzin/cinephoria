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
readonly class EmployeeListProvider implements ProviderInterface
{
    public function __construct(private UserRepository $userRepository)
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

        return array_unique([...$employee, ...$admin], SORT_REGULAR);
    }
}
