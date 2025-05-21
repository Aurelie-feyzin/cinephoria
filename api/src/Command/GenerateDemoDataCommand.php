<?php
declare(strict_types=1);

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Random\RandomException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:generate-demo-data')]
class GenerateDemoDataCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $manager,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    /**
     * @throws RandomException
     * @throws \Throwable
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $commandStyle = new SymfonyStyle($input, $output);

        $commandStyle->info('Chargement des fixtures de base...');
        $posgresFixture = new ArrayInput([
            'doctrine:fixtures:load',
        ]);

        // disable interactive behavior for the greet command
        $posgresFixture->setInteractive(false);
        $this->getApplication()->doRun($posgresFixture, $output);

        $commandStyle->info('Génération des mots de passe...');
        $this->resetDemoPasswords($commandStyle);

        $mongoFixture = new ArrayInput([
            'doctrine:mongodb:fixtures:load',
        ]);
        $mongoFixture->setInteractive(false);
        $this->getApplication()->doRun($mongoFixture, $output);

        return Command::SUCCESS;
    }

    /**
     * @throws RandomException
     */
    private function resetDemoPasswords(SymfonyStyle $commandStyle): void
    {
        $userTests = ['admin@test.fr', 'employee@test.fr', 'user@test.fr'];
        $users = $this->manager->getRepository(User::class)->findAll();

        foreach ($users as $user) {
            $suffix = ['&a3R9', '4>P7i', '9@Ki5', '{sQ54', '@uE57', '23b;U', '4Kg7*', 'xX>89', 'Sp6;4', '4h3P*'];
            $index = random_int(0, count($suffix) - 1);
            $password = bin2hex(random_bytes(6)).$suffix[$index];
            $user->setPassword($this->passwordHasher->hashPassword($user, $password));
            if (in_array($user->getEmail(), $userTests, true)) {
                $commandStyle->info("User $user->getEmail() : $password");
            }
        }

        $this->manager->flush();
    }
}
