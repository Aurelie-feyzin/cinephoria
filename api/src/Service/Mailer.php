<?php
declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use App\Model\ContactDto;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class Mailer
{
    private MailerInterface $mailer;

    private ParameterBagInterface $params;

    public function __construct(MailerInterface $mailer, ParameterBagInterface $parameterBag)
    {
        $this->mailer = $mailer;
        $this->params = $parameterBag;
    }

    public function sendWelcomeEmail(User $user): void
    {
        $email = (new Email())
            ->to($user->getEmail())
            ->subject('Inscription sur Cinephoria')
            ->text("Nous sommes heureux de vous accueillr dans la communauté de Cinéphoria {$user->getFirstName()}! ❤️");
        $this->mailer->send($email);
    }

    public function sendWelcomeEmployeeEmail(User $user): void
    {
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Création de votre compte employé')
            ->htmlTemplate('emails/new_employee.html.twig')
            ->context([
                'user' => $user,
            ]);
        $this->mailer->send($email);
    }

    public function sendCopyContactEmail(ContactDto $contact): void
    {
        $email = (new TemplatedEmail())
            ->to($contact->email)
            ->subject('Nouveau contact à traiter')
            ->htmlTemplate('emails/contact_copy_message.html.twig')
            ->context([
                'contact' => $contact,
            ]);
        $this->mailer->send($email);
    }

    public function sendContactEmail(ContactDto $contact): void
    {
        $email = (new TemplatedEmail())
            ->to('contact@cinephoria.fr')
            ->subject('Merci pour votre message')
            ->htmlTemplate('emails/contact_new_message.html.twig')
            ->context([
                'contact' => $contact,
            ]);
        $this->mailer->send($email);
    }

    public function sendForgotPassword(User $user, string $token): void
    {
        $baseUrl = $this->params->get('cinephoriaUrl');
        // api/config/routes/coop_tilleuls_forgot_password.yaml
        $prefixForgotPassword = '/forgot-password';
        $email = (new TemplatedEmail())
            ->to($user->getEmail())
            ->subject('Réinitialisation de votre mot de passe')
            ->htmlTemplate('emails/reset_password.html.twig')
            ->context([
                'user' => $user,
                'reset_password_url' => sprintf('%s%s/%s', $baseUrl, $prefixForgotPassword, $token),
            ]);

        $this->mailer->send($email);
    }
}
