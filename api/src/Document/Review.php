<?php
declare(strict_types=1);

namespace App\Document;

use ApiPlatform\Doctrine\Odm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\ReviewStatus;
use App\State\ReviewsByMovieProvider;
use App\State\UserReservationsProvider;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(uriTemplate: '/reviews/{id}', security: "is_granted('ROLE_USER')"),
        new GetCollection(uriTemplate: '/user/reviews', security: "is_granted('ROLE_USER')", provider: UserReservationsProvider::class),
        new GetCollection(uriTemplate: '/movies/{id}/reviews', provider: ReviewsByMovieProvider::class),
        new GetCollection(uriTemplate: '/reviews', normalizationContext: ['groups' => ['review']]),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_USER')"),
    ],
    mercure: false)]
#[ODM\Document(collection: 'reviews')]
#[ODM\HasLifecycleCallbacks]
#[ApiFilter(SearchFilter::class, properties: ['status'])]
class Review
{
    #[ODM\Id()]
    private ?string $id;
    #[ODM\Field(type: Types::STRING)]
    #[Groups(['reservation', 'review'])]
    private string $comment;

    #[ODM\Field(type: Types::INTEGER, nullable: false)]
    #[Assert\NotNull]
    #[Assert\PositiveOrZero()]
    #[Assert\LessThanOrEqual(5)]
    #[Groups(['reservation', 'review'])]
    private int $rating;

    #[ODM\ReferenceOne(targetDocument: Reservation::class, inversedBy: 'review')]
    #[Assert\NotNull]
    #[Groups(['review'])]
    private Reservation $reservation;

    #[ODM\Field(type: Types::STRING, nullable: false)]
    #[Assert\NotNull]
    private ?string $movieId;

    #[ODM\Field(type: Types::STRING, nullable: false, enumType: ReviewStatus::class)]
    #[Groups(['reservation', 'review'])]
    private ReviewStatus $status = ReviewStatus::SUBMITTED;

    #[ODM\Field(type: Types::DATE_IMMUTABLE, nullable: false)]
    #[Groups(['reservation', 'review'])]
    private ?DateTimeImmutable $createdAt = null;

    #[ODM\Field(type: Types::DATE_IMMUTABLE, nullable: true)]
    #[Groups(['reservation', 'review'])]
    private ?DateTimeImmutable $updatedAt = null;

    #[ODM\PrePersist]
    public function updateCreatedAt(): void
    {
        $this->createdAt = new DateTimeImmutable();
    }

    #[ODM\PrePersist]
    #[ODM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new DateTimeImmutable();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): Review
    {
        $this->id = $id;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(string $comment): Review
    {
        $this->comment = $comment;

        return $this;
    }

    public function getRating(): int
    {
        return $this->rating;
    }

    public function setRating(int $rating): Review
    {
        $this->rating = $rating;

        return $this;
    }

    public function getReservation(): Reservation
    {
        return $this->reservation;
    }

    public function setReservation(Reservation $reservation): Review
    {
        $this->reservation = $reservation;
        $this->setMovieId($reservation->getMovieId());

        return $this;
    }

    public function getMovieId(): string
    {
        return $this->movieId;
    }

    public function setMovieId(string $movieId): Review
    {
        $this->movieId = $movieId;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getStatus(): ReviewStatus
    {
        return $this->status;
    }

    public function setStatus(ReviewStatus $status): Review
    {
        $this->status = $status;

        return $this;
    }

    public function setCreatedAt(?DateTimeImmutable $createdAt): Review
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): Review
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
