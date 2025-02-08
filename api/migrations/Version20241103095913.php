<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241103095913 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE movie_show (id UUID NOT NULL, movie_theater_id UUID NOT NULL, movie_id UUID NOT NULL, date DATE NOT NULL, start_time VARCHAR(5) NOT NULL, end_time VARCHAR(5) NOT NULL, price_in_cents SMALLINT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C168F80C3EFE3445 ON movie_show (movie_theater_id)');
        $this->addSql('CREATE INDEX IDX_C168F80C8F93B6FC ON movie_show (movie_id)');
        $this->addSql('COMMENT ON COLUMN movie_show.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie_show.movie_theater_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie_show.movie_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie_show.date IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE movie_theater (id UUID NOT NULL, cinema_id UUID NOT NULL, projection_quality_id UUID NOT NULL, number_of_seats SMALLINT NOT NULL, reduced_mobility_seats SMALLINT NOT NULL, theater_name VARCHAR(50) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_664BC37AB4CB84B6 ON movie_theater (cinema_id)');
        $this->addSql('CREATE INDEX IDX_664BC37AD4214238 ON movie_theater (projection_quality_id)');
        $this->addSql('COMMENT ON COLUMN movie_theater.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie_theater.cinema_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie_theater.projection_quality_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE projection_quality (id UUID NOT NULL, name VARCHAR(50) NOT NULL, format VARCHAR(20) NOT NULL, audio_system VARCHAR(20) NOT NULL, suggested_price SMALLINT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN projection_quality.id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE movie_show ADD CONSTRAINT FK_C168F80C3EFE3445 FOREIGN KEY (movie_theater_id) REFERENCES movie_theater (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE movie_show ADD CONSTRAINT FK_C168F80C8F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE movie_theater ADD CONSTRAINT FK_664BC37AB4CB84B6 FOREIGN KEY (cinema_id) REFERENCES cinema (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE movie_theater ADD CONSTRAINT FK_664BC37AD4214238 FOREIGN KEY (projection_quality_id) REFERENCES projection_quality (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE opening_hours ALTER opening_time SET NOT NULL');
        $this->addSql('ALTER TABLE opening_hours ALTER opening_time TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE opening_hours ALTER closing_time SET NOT NULL');
        $this->addSql('ALTER TABLE opening_hours ALTER closing_time TYPE VARCHAR(255)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE movie_show DROP CONSTRAINT FK_C168F80C3EFE3445');
        $this->addSql('ALTER TABLE movie_show DROP CONSTRAINT FK_C168F80C8F93B6FC');
        $this->addSql('ALTER TABLE movie_theater DROP CONSTRAINT FK_664BC37AB4CB84B6');
        $this->addSql('ALTER TABLE movie_theater DROP CONSTRAINT FK_664BC37AD4214238');
        $this->addSql('DROP TABLE movie_show');
        $this->addSql('DROP TABLE movie_theater');
        $this->addSql('DROP TABLE projection_quality');
        $this->addSql('ALTER TABLE opening_hours ALTER opening_time DROP NOT NULL');
        $this->addSql('ALTER TABLE opening_hours ALTER opening_time TYPE VARCHAR(5)');
        $this->addSql('ALTER TABLE opening_hours ALTER closing_time DROP NOT NULL');
        $this->addSql('ALTER TABLE opening_hours ALTER closing_time TYPE VARCHAR(5)');
    }
}
