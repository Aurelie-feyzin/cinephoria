<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__)
    ->exclude(['var', 'vendor'])
;

return (new PhpCsFixer\Config())
    ->setRules([
        '@Symfony' => true,
        'array_syntax' => ['syntax' => 'short'],
        'blank_line_after_opening_tag' => false,
        'declare_strict_types' => true,
        'global_namespace_import' => false,
        'no_superfluous_phpdoc_tags' => ['remove_inheritdoc' => false],
    ])
    ->setUsingCache(false)
    ->setFinder($finder)
;
