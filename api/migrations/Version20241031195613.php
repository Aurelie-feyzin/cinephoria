<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241031195613 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'US3 create cinema address and opening_hours';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id UUID NOT NULL, street VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, postal_code VARCHAR(10) NOT NULL, country_code VARCHAR(2) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN address.id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE cinema (id UUID NOT NULL, address_id UUID NOT NULL, name VARCHAR(255) NOT NULL, phone_number VARCHAR(20) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D48304B4F5B7AF75 ON cinema (address_id)');
        $this->addSql('COMMENT ON COLUMN cinema.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN cinema.address_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE opening_hours (id UUID NOT NULL, cinema_id UUID DEFAULT NULL, day_of_week VARCHAR(10) NOT NULL, opening_time VARCHAR(5), closing_time VARCHAR(5), PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2640C10BB4CB84B6 ON opening_hours (cinema_id)');
        $this->addSql('COMMENT ON COLUMN opening_hours.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN opening_hours.cinema_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE cinema ADD CONSTRAINT FK_D48304B4F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE opening_hours ADD CONSTRAINT FK_2640C10BB4CB84B6 FOREIGN KEY (cinema_id) REFERENCES cinema (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cinema DROP CONSTRAINT FK_D48304B4F5B7AF75');
        $this->addSql('ALTER TABLE opening_hours DROP CONSTRAINT FK_2640C10BB4CB84B6');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE cinema');
        $this->addSql('DROP TABLE opening_hours');
    }
}
