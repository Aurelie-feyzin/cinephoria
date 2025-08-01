<?php
declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ApiFixtureController extends AbstractController
{
    #[Route('api/complete-fixtures', name: 'complete_fixtures', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function runFixtures(KernelInterface $kernel): JsonResponse
    {
        set_time_limit(300);
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $originalErrorReporting = error_reporting();

        error_reporting($originalErrorReporting & ~E_USER_DEPRECATED);

        $postgresInput = new ArrayInput([
            'command' => 'doctrine:fixtures:load',
            '--group' => ['MovieShowAdditionFixtures'],
            '--append' => true,
            '--no-interaction' => true,
        ]);
        $output = new BufferedOutput();
        $exitCode = $application->doRun($postgresInput, $output);

        if (0 !== $exitCode) {
            return new JsonResponse([
                'status' => 'error',
                'output' => $output->fetch(),
            ], 500);
        }

        $mongoInput = new ArrayInput([
            'command' => 'doctrine:mongodb:fixtures:load',
            '--group' => ['ReservationFixtures', 'ReviewFixtures'],
            '--append' => true,
            '--no-interaction' => true,
        ]);
        $mongoInput->setInteractive(false);

        $output = new BufferedOutput();
        $exitCode = $application->doRun($mongoInput, $output);

        return new JsonResponse([
            'status' => 0 === $exitCode ? 'Terminé' : 'Erreur',
            'output' => $output->fetch(),
        ], 0 === $exitCode ? 200 : 500);
    }
}
