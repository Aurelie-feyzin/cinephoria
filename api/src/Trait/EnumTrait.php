<?php
declare(strict_types=1);

namespace App\Trait;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Operation;
use Symfony\Component\Serializer\Attribute\Groups;

trait EnumTrait
{
    #[ApiProperty(types: ['https://schema.org/identifier'])]
    public function getId(): string
    {
        return $this->name;
    }

    #[Groups('read')]
    #[ApiProperty(types: ['https://schema.org/name'])]
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @return mixed[]
     */
    public static function getCases(): array
    {
        return self::cases();
    }

    /**
     * @param string[] $uriVariables
     *                               {@inheritdoc}
     */
    public static function getCase(Operation $operation, array $uriVariables): mixed
    {
        $name = $uriVariables['id'] ?? null;

        return self::tryFrom($name) ?? constant(self::class."::$name");
    }
}
