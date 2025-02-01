<?php
declare(strict_types=1);

namespace App\Entity;

use App\Entity\Abstraction\Installation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Seat extends Installation
{
}
