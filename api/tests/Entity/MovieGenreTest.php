<?php
declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\MovieGenre;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use TypeError;

class MovieGenreTest extends KernelTestCase
{
    private ValidatorInterface $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = self::getContainer()->get(ValidatorInterface::class);
    }

    public function testValidUser(): void
    {
        $genre = (new MovieGenre())
            ->setname('New genre')
            ->setTmbdId(1234);

        $errors = $this->validator->validate($genre);
        $this->assertCount(0, $errors);
    }

    public function testNullName(): void
    {
        $this->expectException(TypeError::class);
        (new MovieGenre())->setName(null);
    }

    public function testBlankName(): void
    {
        $user = (new MovieGenre())->setName('');

        $errors = $this->validator->validate($user);
        $this->assertGreaterThan(0, count($errors));
    }

    public function testNullTmbdId(): void
    {
        $this->expectException(TypeError::class);
        (new MovieGenre())->setTmbdId(null);
    }

    public function testNotIntegerTmbdId(): void
    {
        $this->expectException(TypeError::class);
        (new MovieGenre())->setTmbdId('1234');
    }
}
