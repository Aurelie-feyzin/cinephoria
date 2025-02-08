<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250131212358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE projection_installation (id UUID NOT NULL, movie_theater_id UUID DEFAULT NULL, projection_quality_id UUID DEFAULT NULL, name VARCHAR(50) NOT NULL, status VARCHAR(255) NOT NULL, repair_details TEXT DEFAULT NULL, last_maintenance_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, last_repair_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_550E485D3EFE3445 ON projection_installation (movie_theater_id)');
        $this->addSql('CREATE INDEX IDX_550E485DD4214238 ON projection_installation (projection_quality_id)');
        $this->addSql('COMMENT ON COLUMN projection_installation.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projection_installation.movie_theater_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projection_installation.projection_quality_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN projection_installation.last_maintenance_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN projection_installation.last_repair_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE seat (id UUID NOT NULL, movie_theater_id UUID DEFAULT NULL, name VARCHAR(50) NOT NULL, status VARCHAR(255) NOT NULL, repair_details TEXT DEFAULT NULL, last_maintenance_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, last_repair_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, reduced_mobility_seat BOOLEAN DEFAULT false NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_3D5C36663EFE3445 ON seat (movie_theater_id)');
        $this->addSql('COMMENT ON COLUMN seat.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN seat.movie_theater_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN seat.last_maintenance_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN seat.last_repair_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE projection_installation ADD CONSTRAINT FK_550E485D3EFE3445 FOREIGN KEY (movie_theater_id) REFERENCES movie_theater (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE projection_installation ADD CONSTRAINT FK_550E485DD4214238 FOREIGN KEY (projection_quality_id) REFERENCES projection_quality (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE seat ADD CONSTRAINT FK_3D5C36663EFE3445 FOREIGN KEY (movie_theater_id) REFERENCES movie_theater (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE projection_installation DROP CONSTRAINT FK_550E485D3EFE3445');
        $this->addSql('ALTER TABLE projection_installation DROP CONSTRAINT FK_550E485DD4214238');
        $this->addSql('ALTER TABLE seat DROP CONSTRAINT FK_3D5C36663EFE3445');
        $this->addSql('DROP TABLE projection_installation');
        $this->addSql('DROP TABLE seat');
    }
}
