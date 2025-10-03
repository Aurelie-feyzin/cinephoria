<?php
declare(strict_types=1);

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use App\Entity\User;
use App\Repository\UserRepository;
use App\State\EmployeeListProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Uid\UuidV4;

class EmployeeListProviderTest extends TestCase
{
    /**
     * @param User[] $employeeData
     * @param User[] $adminData
     * @param User[] $expectedOrder
     *
     * @dataProvider employeeListProvider
     *
     * @throws \JsonException
     */
    public function testEmployeeList(array $employeeData, array $adminData, int $expectedCount, array $expectedOrder): void
    {
        $repo = $this->createMock(UserRepository::class);
        $repo->method('findByRole')
            ->willReturnOnConsecutiveCalls($employeeData, $adminData);

        $provider = new EmployeeListProvider($repo);

        /** @var User[] $list */
        $list = $provider->provide($this->createMock(Operation::class), [], []);
        $this->assertCount($expectedCount, $list);

        foreach ($expectedOrder as $index => $expectedUser) {
            $this->assertSame($expectedUser, $list[$index]);
        }
    }

    /**
     * @param string[] $roles
     */
    private function createUser(string $firstName, array $roles): User
    {
        $user = new User();
        $user->setId(new UuidV4())
            ->setFirstName($firstName)
            ->setRoles($roles);

        return $user;
    }

    /**
     * @return array<string, array{?array<User>, ?array<User>, int, ?array<User>}>
     */
    public function employeeListProvider(): array
    {
        $employee = $this->createUser('employee', ['ROLE_EMPLOYEE']);
        $admin = $this->createUser('admin', ['ROLE_ADMIN']);

        return [
            'admin and employe' => [[$employee], [$admin], 2,  [$employee, $admin]],
            'only employee' => [[$employee],  [],  1,  [$employee]],
            'only admin' => [[], [$admin],  1,  [$admin]],
            'none employee and none admin' => [[],  [],  0,  []],
            'role admin and user for same user' => [[$admin],  [$admin],  1,  []],
        ];
    }
}
