<?php
declare(strict_types=1);

namespace App\Tests\Service;

use App\Entity\User;
use App\Model\ContactDto;
use App\Service\Mailer;
use PHPUnit\Framework\TestCase;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Mailer\MailerInterface;

class MailerTest extends TestCase
{
    /**
     * @param string[] $expectedContextKeys
     *
     * @dataProvider emailMethodsProvider
     */
    public function testEmailMethods(
        string $method,
        object $entity,
        string $expectedTo,
        string $expectedSubject,
        string $expectedTemplate = '',
        array $expectedContextKeys = [],
    ): void {
        $mailerMock = $this->createMock(MailerInterface::class);
        $paramsMock = $this->createMock(ParameterBagInterface::class);

        $paramsMock->method('get')->willReturnMap([
            ['cinephoriaUrl', 'https://cinephoria.test'],
        ]);

        $mailerMock->expects($this->once())
            ->method('send')
            ->with($this->callback(function ($email) use ($expectedTo, $expectedSubject, $expectedTemplate, $expectedContextKeys) {
                // Vérifier le destinataire
                $toEmail = $email->getTo()[0]->getAddress();
                if ($toEmail !== $expectedTo) {
                    return false;
                }

                // Vérifier le sujet
                if ($email->getSubject() !== $expectedSubject) {
                    return false;
                }

                if ($expectedTemplate) {
                    if (!($email instanceof TemplatedEmail)) {
                        return false;
                    }
                    if ($email->getHtmlTemplate() !== $expectedTemplate) {
                        return false;
                    }
                    // Vérifier les clés du contexte
                    foreach ($expectedContextKeys as $key) {
                        if (!array_key_exists($key, $email->getContext())) {
                            return false;
                        }
                    }
                }

                return true;
            }));

        $service = new Mailer($mailerMock, $paramsMock);

        // Appel dynamique de la méthode
        $service->$method($entity, ...('sendForgotPassword' === $method ? ['123token'] : []));
    }

    /**
     * @return array<int, array<int, User|ContactDto|array<int, string>|string>>
     */
    public function emailMethodsProvider(): array
    {
        $user = new User();
        $user->setFirstName('John')->setEmail('john.doe@test.com');

        $contact = new ContactDto('John', 'Doe', 'contact@test.com', 'title', 'description');

        $contact->email = 'contact@test.com';

        return [
            ['sendWelcomeEmail', $user, 'john.doe@test.com', 'Inscription sur Cinephoria', '', []],
            ['sendWelcomeEmployeeEmail', $user, 'john.doe@test.com', 'Création de votre compte employé', 'emails/new_employee.html.twig', ['user']],
            ['sendCopyContactEmail', $contact, 'contact@test.com', 'Merci pour votre message', 'emails/contact_copy_message.html.twig', ['contact']],
            ['sendContactEmail', $contact, 'contact@cinephoria.me', 'Nouveau contact à traiter', 'emails/contact_new_message.html.twig', ['contact']],
            ['sendForgotPassword', $user, 'john.doe@test.com', 'Réinitialisation de votre mot de passe', 'emails/reset_password.html.twig', ['user', 'reset_password_url']],
        ];
    }
}
