<?php
declare(strict_types=1);

namespace App\Entity;

use App\Entity\Trait\IdTrait;
use CoopTilleuls\ForgotPasswordBundle\Entity\AbstractPasswordToken;
use Doctrine\ORM\Mapping as ORM;

/* https://github.com/coopTilleuls/CoopTilleulsForgotPasswordBundle/blob/2.0/docs/index.md */
#[ORM\Entity]
class PasswordToken extends AbstractPasswordToken
{
    use IdTrait;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser($user): self
    {
        $this->user = $user;

        return $this;
    }
}
