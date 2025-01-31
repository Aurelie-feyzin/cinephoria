<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Service\Mailer;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/** @implements ProcessorInterface<User, mixed> */
#[AsDecorator('api_platform.doctrine.orm.state.persist_processor')]
class UserHashPasswordStateProcessor implements ProcessorInterface
{
    private Mailer $mailer;

    /**
     * @param ProcessorInterface<User, mixed> $innerProcessor
     */
    public function __construct(private readonly ProcessorInterface $innerProcessor, private readonly UserPasswordHasherInterface $userPasswordHasher, Mailer $mailer)
    {
        $this->mailer = $mailer;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof User && $data->getPlainPassword()) {
            $data->setPassword($this->userPasswordHasher->hashPassword($data, $data->getPlainPassword()));
        }

        $this->innerProcessor->process($data, $operation, $uriVariables, $context);

        if ($data instanceof User) {
            $this->mailer->sendWelcomeEmail($data);
        }

        return $data;
    }
}
