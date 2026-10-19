.PHONY: up down build reload

up:
	docker compose up

down:
	docker compose down

build:
	docker compose build

reload:
	$(MAKE) down
	$(MAKE) build
	$(MAKE) up
