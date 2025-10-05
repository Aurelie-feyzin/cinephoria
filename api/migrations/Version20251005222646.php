<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251005222646 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Delete media_objet';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE movie DROP CONSTRAINT fk_1d5ef26f653b68c9');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP INDEX idx_1d5ef26f653b68c9');
        $this->addSql('ALTER TABLE movie DROP backdrop_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_object (id UUID NOT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN media_object.id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE movie ADD backdrop_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN movie.backdrop_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE movie ADD CONSTRAINT fk_1d5ef26f653b68c9 FOREIGN KEY (backdrop_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_1d5ef26f653b68c9 ON movie (backdrop_id)');
    }
}
