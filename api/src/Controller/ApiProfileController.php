<?php
declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ApiProfileController extends AbstractController
{
    public function __construct(private readonly Security $security)
    {
    }

    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $role = null;
        if ($this->security->isGranted('ROLE_EMPLOYEE')) {
            $role = 'employee';
        }
        if ($this->security->isGranted('ROLE_ADMIN')) {
            $role = 'admin';
        }

        return $this->json([
            'email' => $user->getUserIdentifier(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'role' => $role,
        ]);
    }
}
