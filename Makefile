# ----- Colors -----
GREEN = /bin/echo -e "\x1b[32m\#\# $1\x1b[0m"
RED = /bin/echo -e "\x1b[31m\#\# $1\x1b[0m"
# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
PHP_CONTAINER_CMD = $(DOCKER_COMP) exec php
PWA_CONTAINER_CMD = $(DOCKER_COMP) exec pwa

# Directories
DESKTOP_APP_DIR = cd desktop_app
EXPO_APP_DIR = cd react_expo

# Executables
PHP      = $(PHP_CONTAINER_CMD) php
COMPOSER = $(PHP_CONTAINER_CMD) composer
SYMFONY_CONSOLE  = $(PHP_CONTAINER_CMD) bin/console
VENDOR  =  $(PHP) vendor/bin
PWA_PNPM_CMD  =  $(PWA_CONTAINER_CMD) pnpm

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
	$(PHP_CONTAINER_CMD) bash

db-diff: ## Generate a migration
	$(SYMFONY_CONSOLE) doctrine:migrations:diff

db-migrate: ## Migrate the database
	@$(call GREEN, "Migrating database...")
	$(SYMFONY_CONSOLE) doctrine:migrations:migrate --no-interaction

fixtures: ## Load the fixtures
	@$(call GREEN, "Loading fixtures...")
	$(SYMFONY_CONSOLE) doctrine:fixtures:load --no-interaction  --group=initialize
	$(SYMFONY_CONSOLE) doctrine:mongodb:fixtures:load --no-interaction

cache-clear: ## Clear the cache
	@$(call GREEN, "Clearing cache...")
	$(SYMFONY_CONSOLE) cache:clear

fix-cs: ## php-cs-fixer
	${VENDOR}/php-cs-fixer fix --ansi --allow-risky=yes --using-cache=no --show-progress=dots --config=.php-cs-fixer.dist.php -v

phpmd:
	${VENDOR}/phpmd src text phpmd-ruleset.xml --suffixes=php

phpstan:
	${VENDOR}/phpstan analyse --no-progress --no-interaction --configuration=phpstan.neon --memory-limit=-1

phpunit:
	@$(call GREEN, "Preparation bdd...")
	$(SYMFONY_CONSOLE) doctrine:database:drop --force --if-exists --env test
	$(SYMFONY_CONSOLE) doctrine:database:create --env test
	$(SYMFONY_CONSOLE) doctrine:query:sql 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' --env test
	$(SYMFONY_CONSOLE) doctrine:schema:update --force --complete --env test
	$(PHP) bin/phpunit

security-checker:
	$(COMPOSER) audit
## —— PWA —————————————————————————————————————————————————————
sh:
	$(PWA_CONTAINER_CMD) sh

pwa-lint: ## Lints JS coding standarts
	$(PWA_PNPM_CMD) lint
	$(PWA_PNPM_CMD) type-check

pwa-audit: ## Checks for known security issues with the installed packages.
	$(PWA_PNPM_CMD) audit

## —— DESKTOP APP —————————————————————————————————————————————————————
tauri-lint: ## Lints JS coding standarts
	$(DESKTOP_APP_DIR) && pnpm lint
	$(DESKTOP_APP_DIR) && pnpm type-check

tauri-audit: ## Checks for known security issues with the installed packages.
	$(DESKTOP_APP_DIR) && pnpm audit

## —— Expo APP —————————————————————————————————————————————————————
expo-lint: ## Lints JS coding standarts
	$(EXPO_APP_DIR) && pnpm lint
	$(EXPO_APP_DIR) && pnpm type-check

expo-audit: ## Checks for known security issues with the installed packages.
	$(EXPO_APP_DIR) && pnpm audit

## —— Quality and security —————————————————————————————————————————————————————
php-quality:
	@$(call GREEN, "PHP code quality")
	$(MAKE) fix-cs
	$(MAKE) phpmd
	$(MAKE) phpstan

pwa-quality:
	@$(call GREEN, "PWA code quality")
	$(MAKE) pwa-lint

tauri-quality:
	@$(call GREEN, "DESKTOP code quality")
	$(MAKE) tauri-lint

expo-quality:
	@$(call GREEN, "EXPO code quality")
	$(MAKE) expo-lint

code-quality: php-quality pwa-quality tauri-quality expo-quality

security:
	@$(call GREEN, "PHP security")
	$(MAKE) security-checker
	@$(call GREEN, "PWA security")
	$(MAKE) pwa-audit
	@$(call GREEN, "DESKTOP security")
	$(MAKE) tauri-audit
	@$(call GREEN, "Expo security")
	$(MAKE) expo-audit
