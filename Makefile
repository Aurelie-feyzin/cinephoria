# ----- Colors -----
GREEN = /bin/echo -e "\x1b[32m\#\# $1\x1b[0m"
RED = /bin/echo -e "\x1b[31m\#\# $1\x1b[0m"
# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
PHP_CONT = $(DOCKER_COMP) exec php
PWA_CONT = $(DOCKER_COMP) exec pwa

# Executables
PHP      = $(PHP_CONT) php
COMPOSER = $(PHP_CONT) composer
SYMFONY_CONSOLE  = $(PHP_CONT) bin/console
VENDOR  =  $(PHP) vendor/bin
PNPM  =  $(PWA_CONT) pnpm

## —— Docker ————————————————————————————————————————————————————————————————
build:
	@$(DOCKER_COMP) build --pull --no-cache

up:
	@$(DOCKER_COMP) up -d

down:
	@$(DOCKER_COMP) down --remove-orphans

logs:
	@$(DOCKER_COMP) logs --tail=0 --follow

## —— Symfony ————————————————————————————————————————————————————————————————
bash:
	$(PHP_CONT) bash

db-diff: ## Generate a migration
	$(SYMFONY_CONSOLE) doctrine:migrations:diff

db-migrate: ## Migrate the database
	@$(call GREEN, "Migrating database...")
	$(SYMFONY_CONSOLE) doctrine:migrations:migrate --no-interaction

graphql-schema:
	$(SYMFONY_CONSOLE) api:graphql:export -o config/graphql/schema.graphql

fixtures: ## Load the fixtures
	@$(call GREEN, "Loading fixtures...")
	$(SYMFONY_CONSOLE) doctrine:fixtures:load --no-interaction

cache-clear: ## Clear the cache
	@$(call GREEN, "Clearing cache...")
	$(SYMFONY_CONSOLE) cache:clear

fix-cs: ## php-cs-fixer
	${VENDOR}/php-cs-fixer fix --ansi --allow-risky=yes --using-cache=no --show-progress=dots --config=.php-cs-fixer.dist.php -v

phpmd:
	${VENDOR}/phpmd src text phpmd-ruleset.xml --suffixes=php

phpstan:
	${VENDOR}/phpstan analyse --no-progress --no-interaction --configuration=phpstan.neon --memory-limit=-1

security-checker:
	$(COMPOSER) audit
## —— PWA —————————————————————————————————————————————————————
sh:
	$(PWA_CONT) sh

lint: ## Lints JS coding standarts
	$(PNPM) lint

audit: ## Checks for known security issues with the installed packages.
	$(PNPM) audit

## —— Quality and security —————————————————————————————————————————————————————
code-quality: ## Run the tests
	@$(call GREEN, "PHP code quality")
	$(MAKE) fix-cs
	$(MAKE) phpmd
	$(MAKE) phpstan
	@$(call GREEN, "PWA code quality")
	$(MAKE) lint

security:
	@$(call GREEN, "PHP security")
	$(MAKE) security-checker
	@$(call GREEN, "JS security")
	$(MAKE) audit
