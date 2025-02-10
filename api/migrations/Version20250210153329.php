<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250210153329 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE movie ADD backdrop_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN movie.backdrop_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE movie ADD CONSTRAINT FK_1D5EF26F653B68C9 FOREIGN KEY (backdrop_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_1D5EF26F653B68C9 ON movie (backdrop_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE movie DROP CONSTRAINT FK_1D5EF26F653B68C9');
        $this->addSql('DROP INDEX IDX_1D5EF26F653B68C9');
        $this->addSql('ALTER TABLE movie DROP backdrop_id');
    }
}
