<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250801080854 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D4E6F81F0EED3D82D5B0234 ON address (street, city)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D48304B45E237E06F5B7AF75 ON cinema (name, address_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1D5EF26F2B36786BE769876D ON movie (title, release_date)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_D48304B45E237E06F5B7AF75');
        $this->addSql('DROP INDEX UNIQ_1D5EF26F2B36786BE769876D');
        $this->addSql('DROP INDEX UNIQ_D4E6F81F0EED3D82D5B0234');
    }
}
