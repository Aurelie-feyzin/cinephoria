<?php
declare(strict_types=1);

namespace App\Tests\DataFixtures;

use App\Entity\Address;
use App\Entity\Cinema;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CinemaTestFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $address = (new Address())
            ->setCity('city')
            ->setStreet('street')
            ->setCountryCode('fr')
            ->setPostalCode('postalCode')
        ;
        $manager->persist($address);

        $cinema = (new Cinema())
            ->setName('Test Cinema')
            ->setAddress($address)
            ->setPhoneNumber('phoneNumber')
        ;
        $this->addReference('cinema', $cinema);
        $manager->persist($cinema);

        $manager->flush();
    }
}
