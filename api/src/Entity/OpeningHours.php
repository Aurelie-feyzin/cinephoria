<?php
declare(strict_types=1);

namespace App\Entity;

use App\Entity\Trait\IdTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class OpeningHours
{
    use IdTrait;
    #[ORM\ManyToOne(targetEntity: Cinema::class, inversedBy: 'openingHours')]
    #[Assert\NotNull]
    private Cinema $cinema;

    #[ORM\Column(type: 'string', length: 10)]
    #[Assert\NotBlank]
    private string $dayOfWeek;

    #[ORM\Column(type: 'string')]
    #[Assert\Time(withSeconds: false)]
    private string $openingTime;

    #[ORM\Column(type: 'string')]
    #[Assert\Time(withSeconds: false)]
    private string $closingTime;

    public function getCinema(): Cinema
    {
        return $this->cinema;
    }

    public function setCinema(Cinema $cinema): OpeningHours
    {
        $this->cinema = $cinema;

        return $this;
    }

    public function getDayOfWeek(): string
    {
        return $this->dayOfWeek;
    }

    public function setDayOfWeek(string $dayOfWeek): OpeningHours
    {
        $this->dayOfWeek = $dayOfWeek;

        return $this;
    }

    public function getOpeningTime(): string
    {
        return $this->openingTime;
    }

    public function setOpeningTime(string $openingTime): OpeningHours
    {
        $this->openingTime = $openingTime;

        return $this;
    }

    public function getClosingTime(): string
    {
        return $this->closingTime;
    }

    public function setClosingTime(string $closingTime): OpeningHours
    {
        $this->closingTime = $closingTime;

        return $this;
    }
}
