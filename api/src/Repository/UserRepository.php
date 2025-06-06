<?php
declare(strict_types=1);
// api/src/Repository/UserRepository.php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity): void
    {
        $this->getEntityManager()->persist($entity);
    }

    public function remove(User $entity): void
    {
        $this->getEntityManager()->remove($entity);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->setPassword($newHashedPassword);

        $this->save($user);
        $this->getEntityManager()->flush();
    }

    public function findByRole(string $role): mixed
    {
        $rsm = $this->createResultSetMappingBuilder('u');

        $query = <<<SQL
        SELECT %s
        FROM "user" u
        WHERE u.roles::jsonb ?? :role
    SQL;

        $rawQuery = sprintf($query, $rsm->generateSelectClause());

        $query = $this->getEntityManager()->createNativeQuery($rawQuery, $rsm);
        $query->setParameter('role', $role);

        return $query->getResult();
    }
}
