# Usage:
#   make setup     # Create/update and install dependencies
#   make generate  # Regenerate SDK code from proto sources
#   make lint      # Run static checks
#   make test      # Run unit tests

SHELL := /bin/bash

PROTO_REPO_URL := https://github.com/scalekit-inc/scalekit.git
PROTO_REF := v0.1.106.2
PROTO_SUBDIR := proto
PROTO_REMOTE_INPUT := $(PROTO_REPO_URL)\#ref=$(PROTO_REF),subdir=$(PROTO_SUBDIR)
PROTOC_GEN_ES_VERSION := 2.11.0

.PHONY: setup check-protoc-gen-es-version generate lint test verify-generate

setup:
	npm ci

check-protoc-gen-es-version:
	@node -e "try { const v = require('./node_modules/@bufbuild/protoc-gen-es/package.json').version; if (v !== '$(PROTOC_GEN_ES_VERSION)') { console.error('Expected @bufbuild/protoc-gen-es $(PROTOC_GEN_ES_VERSION), found ' + v + '. Run make setup.'); process.exit(1); } } catch (e) { console.error('Missing @bufbuild/protoc-gen-es. Run make setup.'); process.exit(1); }"

generate:
	$(MAKE) check-protoc-gen-es-version
	npm run generate --src="$(PROTO_REMOTE_INPUT)"

lint:
	npm run lint

test:
	npm run test

verify-generate:
	$(MAKE) generate
	git diff --exit-code
	@untracked="$$(git ls-files --others --exclude-standard)"; \
	if [ -n "$$untracked" ]; then \
		echo "Untracked files detected after generation:"; \
		echo "$$untracked"; \
		exit 1; \
	fi
