<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250121185422 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE password_token (id UUID NOT NULL, user_id UUID NOT NULL, token VARCHAR(50) NOT NULL, expires_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_BEAB6C245F37A13B ON password_token (token)');
        $this->addSql('CREATE INDEX IDX_BEAB6C24A76ED395 ON password_token (user_id)');
        $this->addSql('COMMENT ON COLUMN password_token.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN password_token.user_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE password_token ADD CONSTRAINT FK_BEAB6C24A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE password_token DROP CONSTRAINT FK_BEAB6C24A76ED395');
        $this->addSql('DROP TABLE password_token');
    }
}
