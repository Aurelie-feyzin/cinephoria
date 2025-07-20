<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\Trait\IdTrait;
use App\Repository\UserRepository;
use App\State\EmployeeListProvider;
use App\State\UserHashPasswordStateProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'])]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/employees/{id}',
            normalizationContext: ['groups' => ['employee:read']],
            security: "is_granted('ROLE_ADMIN')",
        ),
        new GetCollection(
            uriTemplate: '/employees',
            order: ['lastName' => 'desc'],
            normalizationContext: ['groups' => ['employee:read']],
            security: "is_granted('ROLE_ADMIN')",
            provider: EmployeeListProvider::class
        ),
        new Post(normalizationContext: ['groups' => ['employee:write']], provider: UserPasswordHasher::class, processor: UserHashPasswordStateProcessor::class),
        new Patch(uriTemplate: '/employees/{id}',
            normalizationContext: ['groups' => ['employee:write']],
            security: "is_granted('ROLE_ADMIN')"),
    ],
    mercure: false
),
]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    use IdTrait;

    #[ORM\Column(length: 180, nullable: false)]
    #[Assert\NoSuspiciousCharacters]
    #[Assert\Email]
    #[Assert\NotNull]
    #[Groups(['employee:read', 'employee:write'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['employee:read', 'employee:write'])]
    private array $roles = [];

    /**
     * The hashed password.
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Groups(['user:write'])]
    #[Assert\Length(
        min: 8,
        minMessage: 'Your password must be at least {{ limit }} characters long.'
    )]
    #[Assert\Regex(
        pattern: '/[A-Z]/',
        message: 'Your password must contain at least one uppercase letter.'
    )]
    #[Assert\Regex(
        pattern: '/[a-z]/',
        message: 'Your password must contain at least one lowercase letter.'
    )]
    #[Assert\Regex(
        pattern: '/[0-9]/',
        message: 'Your password must contain at least one number.'
    )]
    #[Assert\Regex(
        pattern: "/[\W_]/",
        message: 'Your password must contain at least one special character.'
    )]
    #[Assert\NotBlank(groups: (['user:write']))]
    #[Assert\NoSuspiciousCharacters]
    private ?string $plainPassword = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['employee:read'])]
    #[Assert\NotBlank(groups: (['user:write']))]
    private ?string $lastName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['employee:read', 'employee:write'])]
    #[Assert\NotBlank(groups: (['user:write']))]
    private ?string $firstName = null;

    #[Groups(['employee:read', 'employee:write'])]
    public function getId(): ?string
    {
        return (null === $this->id) ? null : $this->id->toRfc4122();
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function setPlainPassword(string $plainPassword): User
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }
}
