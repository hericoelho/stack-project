export ROOT_DIR := $(shell git rev-parse --show-toplevel)
COMPOSE := $(shell command -v podman >/dev/null && echo "podman compose" || echo "docker compose")

exec:
	cd $(ROOT_DIR)/mongoDB && $(COMPOSE) up