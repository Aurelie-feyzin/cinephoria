<?php
declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use App\Model\ContactDto;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
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
            ->from('no-replya@cinephoria.fr')
            ->to($user->getEmail())
            ->subject('Inscription sur Cinephoria')
            ->text("Nous sommes heureux de vous accueillr dans la communauté de Cinéphoria {$user->getFirstName()}! ❤️");
        $this->mailer->send($email);
    }

    public function sendCopyContactEmail(ContactDto $contact): void
    {
        $email = (new TemplatedEmail())
            ->from('contact@cinephoria.fr')
            ->to($contact->email)
            ->subject('Merci pour votre message')
            ->htmlTemplate('emails/contact_copy_message.html.twig')
            ->context([
                'contact' => $contact,
            ]);
        $this->mailer->send($email);
    }

    public function sendContactEmail(ContactDto $contact): void
    {
        $email = (new TemplatedEmail())
            ->from('contact@cinephoria.fr')
            ->to('contact@cinephoria.fr')
            ->subject('Merci pour votre message')
            ->htmlTemplate('emails/contact_new_message.html.twig')
            ->context([
                'contact' => $contact,
            ]);
        $this->mailer->send($email);
    }
}
