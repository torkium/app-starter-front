COMPOSE = docker compose

ensure-env:
	@if [ ! -f .env ]; then \
		echo "The .env file is missing."; \
		echo "Have you initialized the project with make init?"; \
		exit 1; \
	fi

init:
	./scripts/init.sh

up: ensure-env
	$(COMPOSE) up --build -d

down: ensure-env
	$(COMPOSE) down

restart: ensure-env
	$(COMPOSE) up -d --force-recreate

ps: ensure-env
	$(COMPOSE) ps

config: ensure-env
	$(COMPOSE) config

logs: ensure-env
	$(COMPOSE) logs -f frontend

sh: ensure-env
	$(COMPOSE) exec frontend sh

tooling-sh: ensure-env
	$(COMPOSE) run --rm tooling sh

health: ensure-env
	curl -fsS http://localhost:3000/runtime-config.js

lint: ensure-env
	$(COMPOSE) run --rm tooling npm run lint

typecheck: ensure-env
	$(COMPOSE) run --rm tooling npm run typecheck

test: ensure-env
	$(COMPOSE) run --rm tooling npm run test

validate-public-runtime: ensure-env
	$(COMPOSE) run --rm tooling npm run validate:public-runtime

build: ensure-env
	$(COMPOSE) run --rm tooling npm run build

check: ensure-env
	$(COMPOSE) run --rm tooling npm run check

.PHONY: ensure-env init up down restart ps config logs sh tooling-sh health lint typecheck test validate-public-runtime build check
