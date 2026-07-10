export ROOT_DIR := $(shell git rev-parse --show-toplevel)
COMPOSE := $(shell command -v podman >/dev/null && echo "podman compose" || echo "docker compose")

exec:
	cd $(ROOT_DIR)/mongoDB && $(COMPOSE) up -d
	cd $(ROOT_DIR)/backSpring && $(COMPOSE) up -d
	cd $(ROOT_DIR)/bff-nest-js && $(COMPOSE) up -d
	cd $(ROOT_DIR)/frontReact/remote-app && $(COMPOSE) up -d
	cd $(ROOT_DIR)/frontReact/core-app && $(COMPOSE) up

down:
	cd $(ROOT_DIR)/frontReact/core-app && $(COMPOSE) down
	cd $(ROOT_DIR)/frontReact/remote-app && $(COMPOSE) down
	cd $(ROOT_DIR)/bff-nest-js && $(COMPOSE) down
	cd $(ROOT_DIR)/backSpring && $(COMPOSE) down
	cd $(ROOT_DIR)/mongoDB && $(COMPOSE) down