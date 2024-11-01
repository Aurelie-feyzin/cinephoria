<?php
declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Trait\IdTrait;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ApiResource(mercure: true)]
class Cinema
{
    use IdTrait;
    #[ORM\Column(type: 'string', length: 255)]
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
}
