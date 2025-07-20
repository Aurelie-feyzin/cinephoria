<?php
declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use TypeError;

class UserTest extends KernelTestCase
{
    private ValidatorInterface $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = self::getContainer()->get(ValidatorInterface::class);
    }

    public function testValidUser(): void
    {
        $user = (new User())
            ->setFirstName('John')
            ->setLastName('Doe')
            ->setEmail('johndoe@example.com')
            ->setPlainPassword('P@ssword1');

        $errors = $this->validator->validate($user);
        $this->assertCount(0, $errors);
    }

    public function testInvalidEmail(): void
    {
        $user = (new User())->setEmail('invalid-email');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testNullEmail(): void
    {
        $this->expectException(TypeError::class);
        (new User())->setEmail(null);
    }

    public function testNullLastName(): void
    {
        $this->expectException(TypeError::class);
        (new User())->setLastName(null);
    }

    public function testBlankLastName(): void
    {
        $user = (new User())->setLastName('');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testNullFirstName(): void
    {
        $this->expectException(TypeError::class);
        (new User())->setFirstName(null);
    }

    public function testBlankFirstName(): void
    {
        $user = (new User())->setFirstName('');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testShortPassword(): void
    {
        $user = (new User())->setPlainPassword('Short1');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testPasswordWithoutUppercase(): void
    {
        $user = (new User())->setPlainPassword('p@ssword1');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testPasswordWithoutLowercase(): void
    {
        $user = (new User())->setPlainPassword('P@SSWORD1');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testPasswordWithoutNumber(): void
    {
        $user = (new User())->setPlainPassword('P@SSWORD!');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testPasswordWithoutSpecialCharacter(): void
    {
        $user = (new User())->setPlainPassword('Short1');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }
}
