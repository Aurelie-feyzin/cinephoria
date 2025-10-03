<?php
declare(strict_types=1);

namespace App\Tests\Controller;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Service\Mailer;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ContactControllerTest extends ApiTestCase
{
    private Client $client;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient([], [
            'base_uri' => 'http://cinephoria.dvp',
        ]);
    }

    /**
     * @param array<string, string> $message
     *
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     *
     * @dataProvider contactProvider
     */
    public function testContact(bool $sendContactEmail, ?bool $sendCopyContactEmail, int $http_response, array $message): void
    {
        // Mock Mailer
        $mailer = $this->createMock(Mailer::class);
        if ($sendContactEmail) {
            $mailer->expects($this->once())->method('sendContactEmail');
        } else {
            $mailer->method('sendContactEmail')->willThrowException(new \Exception('boom'));
        }

        if (true === $sendCopyContactEmail) {
            $mailer->expects($this->once())->method('sendCopyContactEmail');
        } elseif (false === $sendCopyContactEmail) {
            $mailer->method('sendCopyContactEmail')->willThrowException(new \Exception('boom'));
        }

        // Remplace le service dans le conteneur
        static::getContainer()->set(Mailer::class, $mailer);

        $this->client->request('POST', '/contact', [
            'json' => [
                'firstName' => 'John',
                'lastName' => 'Doe',
                'email' => 'john.doe@email.fr',
                'title' => 'Hello!',
                'description' => 'Un nouveau message',
            ],
            'headers' => [
                'Content-Type' => 'application/ld+json',
            ],
        ]);

        self::assertResponseStatusCodeSame($http_response);
        self::assertJsonContains($message);
    }

    /**
     * @return array<string, array{0:bool, 1:bool|null, 2:int,  3:array<string, string>}>
     */
    public function contactProvider(): array
    {
        return [
            'success' => [true, true, Response::HTTP_OK, ['success' => true]],
            'fails on first email' => [false, null, Response::HTTP_INTERNAL_SERVER_ERROR, ['message' => "Désolée, l'email n'a pas pû être envoyé"]],
            'fail on copy' => [true, false, Response::HTTP_INTERNAL_SERVER_ERROR, ['message' => "L'émail a bien été traité, impossible de vous envoyer une copie"]],
        ];
    }
}
