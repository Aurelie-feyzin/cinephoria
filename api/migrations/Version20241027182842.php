<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241027182842 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'US2 create table movie and movie_genre';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE movie (id UUID NOT NULL, title VARCHAR(255) NOT NULL, poster_path VARCHAR(255) DEFAULT NULL, backdrop_path VARCHAR(255) DEFAULT NULL, duration SMALLINT DEFAULT NULL, description TEXT DEFAULT NULL, favorite BOOLEAN DEFAULT false NOT NULL, rating DOUBLE PRECISION NOT NULL, release_date DATE NOT NULL, age_restriction VARCHAR(255) NOT NULL, warning BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN movie.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie.release_date IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE movie_movie_genre (movie_id UUID NOT NULL, movie_genre_id UUID NOT NULL, PRIMARY KEY(movie_id, movie_genre_id))');
        $this->addSql('CREATE INDEX IDX_D294A5938F93B6FC ON movie_movie_genre (movie_id)');
        $this->addSql('CREATE INDEX IDX_D294A5939E604892 ON movie_movie_genre (movie_genre_id)');
        $this->addSql('COMMENT ON COLUMN movie_movie_genre.movie_id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN movie_movie_genre.movie_genre_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE movie_genre (id UUID NOT NULL, name VARCHAR(255) NOT NULL, tmbd_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN movie_genre.id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE movie_movie_genre ADD CONSTRAINT FK_D294A5938F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE movie_movie_genre ADD CONSTRAINT FK_D294A5939E604892 FOREIGN KEY (movie_genre_id) REFERENCES movie_genre (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE movie_movie_genre DROP CONSTRAINT FK_D294A5938F93B6FC');
        $this->addSql('ALTER TABLE movie_movie_genre DROP CONSTRAINT FK_D294A5939E604892');
        $this->addSql('DROP TABLE movie');
        $this->addSql('DROP TABLE movie_movie_genre');
        $this->addSql('DROP TABLE movie_genre');
    }
}
