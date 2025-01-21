<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\ContactDto;
use App\Service\Mailer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    private Mailer $mailer;

    public function __construct(Mailer $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route('/contact', name: 'contact', methods: ['POST'])]
    public function index(#[MapRequestPayload] ContactDto $contactDto): JsonResponse
    {
        try {
            $this->mailer->sendContactEmail($contactDto);
        } catch (\Exception $e) {
            return $this->json([
                'message' => "Désolée, l'email n'a pas pû être envoyé",
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $this->mailer->sendCopyContactEmail($contactDto);
        } catch (\Exception $e) {
            return $this->json([
                'message' => "L'émail a bien été traité, impossible de vous envoyer une copie",
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['success' => true]);
    }
}
