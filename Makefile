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
	$(PWA_CONTAINER_CMD) sh

pwa-lint: ## Lints JS coding standarts
	$(PWA_PNPM_CMD) lint

pwa-audit: ## Checks for known security issues with the installed packages.
	$(PWA_PNPM_CMD) audit

## —— DESKTOP APP —————————————————————————————————————————————————————
tauri-lint: ## Lints JS coding standarts
	$(DESKTOP_APP_DIR) && pnpm lint

tauri-audit: ## Checks for known security issues with the installed packages.
	$(DESKTOP_APP_DIR) && pnpm audit

## —— Expo APP —————————————————————————————————————————————————————
expo-lint: ## Lints JS coding standarts
	$(EXPO_APP_DIR) && pnpm lint

expo-audit: ## Checks for known security issues with the installed packages.
	$(EXPO_APP_DIR) && pnpm audit

## —— Quality and security —————————————————————————————————————————————————————
code-quality: ## Run the tests
	@$(call GREEN, "PHP code quality")
	$(MAKE) fix-cs
	$(MAKE) phpmd
	$(MAKE) phpstan
	@$(call GREEN, "PWA code quality")
	$(MAKE) pwa-lint
	@$(call GREEN, "DESKTOP code quality")
	$(MAKE) tauri-lint
	@$(call GREEN, "EXPO code quality")
	$(MAKE) expo-lint

security:
	@$(call GREEN, "PHP security")
	$(MAKE) security-checker
	@$(call GREEN, "PWA security")
	$(MAKE) pwa-audit
	@$(call GREEN, "DESKTOP security")
	$(MAKE) tauri-audit
	@$(call GREEN, "Expo security")
	$(MAKE) expo-audit
