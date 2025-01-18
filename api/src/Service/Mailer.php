<?php
declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class Mailer
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendWelcomeEmail(User $user): void
    {
        $email = (new Email())
            ->from('alienmailcarrier@example.com')
            ->to($user->getEmail())
            ->subject('Inscription sur Cinephoria')
            ->text("Nous sommes heureux de vous accueillr dans la communauté de Cinéphoria {$user->getFirstName()}! ❤️");
        $this->mailer->send($email);
    }
}
