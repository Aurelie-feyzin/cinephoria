<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Trait\IdTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ApiResource(mercure: false)]
class Cinema
{
    use IdTrait;
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['movie:read', 'movieShow:read', 'movieTheater:read', 'movieShow:full', 'installation:read', 'installation:full'])]
    private string $name;

    #[ORM\OneToOne(targetEntity: Address::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private Address $address;

    #[ORM\Column(type: 'string', length: 20)]
    private string $phoneNumber;

    /**
     * @var Collection<int, OpeningHours>
     */
    #[ORM\OneToMany(mappedBy: 'cinema', targetEntity: OpeningHours::class, cascade: ['persist', 'remove'])]
    private Collection $openingHours;

    /**
     * @var Collection<int, MovieTheater>
     */
    #[ORM\OneToMany(mappedBy: 'cinema', targetEntity: MovieTheater::class, orphanRemoval: true)]
    private Collection $movieTheaters;

    public function __construct()
    {
        $this->openingHours = new ArrayCollection();
        $this->movieTheaters = new ArrayCollection();
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Cinema
    {
        $this->name = $name;

        return $this;
    }

    public function getAddress(): Address
    {
        return $this->address;
    }

    public function setAddress(Address $address): Cinema
    {
        $this->address = $address;

        return $this;
    }

    public function getPhoneNumber(): string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): Cinema
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    /**
     * @return Collection<int, OpeningHours>
     */
    public function getOpeningHours(): Collection
    {
        return $this->openingHours;
    }

    /**
     * @param Collection<int, OpeningHours> $openingHours
     */
    public function setOpeningHours(Collection $openingHours): Cinema
    {
        $this->openingHours = $openingHours;

        return $this;
    }

    /**
     * @return Collection<int, MovieTheater>
     */
    public function getMovieTheaters(): Collection
    {
        return $this->movieTheaters;
    }
}
