<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Service\Mailer;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/** @implements ProcessorInterface<User, mixed> */
final class UserHashPasswordStateProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<User, mixed> $innerProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $innerProcessor,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
        private readonly Security $security,
        private readonly Mailer $mailer)
    {
    }

    /**
     * @throws \JsonException
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ?User
    {
        if ($data->getPlainPassword()) {
            $data->setPassword($this->userPasswordHasher->hashPassword($data, $data->getPlainPassword()));
        }

        $this->innerProcessor->process($data, $operation, $uriVariables, $context);

        if ($this->security->isGranted('ROLE_ADMIN') && in_array('ROLE_EMPLOYEE', $data->getRoles(), true)) {
            $this->mailer->sendWelcomeEmployeeEmail($data);

            return $data;
        }

        $this->mailer->sendWelcomeEmail($data);

        return null;
    }
}
