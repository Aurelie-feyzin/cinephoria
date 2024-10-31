<?php
declare(strict_types=1);

namespace App\Enum;

/** https://fr.wikipedia.org/wiki/Commission_de_classification_des_%C5%93uvres_cin%C3%A9matographiques */
enum AgeRestriction: string
{
    case ALL = 'Tous publics';
    case TWELVE = '12 ans';
    case SIXTEEN = '16 ans';
    case EIGHTEEN = '18 ans';
    case EIGHTEEN_X = '18 ans classé X';
}
