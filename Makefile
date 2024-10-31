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
database-diff: ## Generate a migration
	$(SYMFONY_CONSOLE) doctrine:migrations:diff

database-migrate: ## Migrate the database
	@$(call GREEN, "Migrating database...")
	$(SYMFONY_CONSOLE) doctrine:migrations:migrate --no-interaction

fixtures: ## Load the fixtures
	@$(call GREEN, "Loading fixtures...")
	$(SYMFONY_CONSOLE) doctrine:fixtures:load --no-interaction

cache-clear: ## Clear the cache
	@$(call GREEN, "Clearing cache...")
	$(SYMFONY_CONSOLE) cache:clear

fix-cs: ## php-cs-fixer
	${VENDOR}/php-cs-fixer fix --ansi --allow-risky=yes --using-cache=no --show-progress=dots --config=.php-cs-fixer.dist.php -v

phpmd: ## phpmd
	${VENDOR}/phpmd src text phpmd-ruleset.xml --suffixes=php

phpstan: ## phpmd
	${VENDOR}/phpstan analyse --no-progress --no-interaction --configuration=phpstan.neon

## —— PWA —————————————————————————————————————————————————————
lint: ## Lints JS coding standarts
	$(PNPM) lint

code-quality: ## Run the tests
	@$(call GREEN, "PHP code quality")
	$(MAKE) fix-cs
	$(MAKE) phpmd
	$(MAKE) phpstan
	@$(call GREEN, "PWA code quality")
	$(MAKE) lint
