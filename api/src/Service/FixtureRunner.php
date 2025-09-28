<?php
declare(strict_types=1);

namespace App\Service;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpKernel\KernelInterface;

class FixtureRunner
{
    public function __construct(private KernelInterface $kernel)
    {
    }

    public function run(ArrayInput $options, BufferedOutput $output): int
    {
        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        return $application->doRun($options, $output);
    }
}
