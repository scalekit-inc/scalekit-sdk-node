# Usage:
#   make setup           # Create/update and install dependencies
#   make generate        # Regenerate SDK code from remote proto sources
#   make generate-local  # Regenerate SDK code from local ../scalekit/proto
#   make lint            # Run static checks
#   make test            # Run unit tests

SHELL := /bin/bash

PROTO_REPO_URL := https://github.com/scalekit-inc/scalekit.git
# DeleteCustomTool is in the backend release v0.1.165.0, which also adds three unrelated read-only
# scalekit_creds_* fields to connections.proto. So the pin is the commit that merged DeleteCustomTool
# (scalekit-inc/scalekit#2882, SK-3096). Move it to a release tag at the next proto sync.
PROTO_REF := 25718aba9c0fbc8833f6f80c7b27ccb655377642
PROTO_SUBDIR := proto
PROTO_REMOTE_INPUT := $(PROTO_REPO_URL)\#ref=$(PROTO_REF),subdir=$(PROTO_SUBDIR)
LOCAL_PROTO_DIR ?= ../scalekit/proto
PROTOC_GEN_ES_VERSION := 2.12.0
.PHONY: setup check-protoc-gen-es-version generate generate-local lint test verify-generate

setup:
	npm ci

check-protoc-gen-es-version:
	@node -e "try { const v = require('./node_modules/@bufbuild/protoc-gen-es/package.json').version; if (v !== '$(PROTOC_GEN_ES_VERSION)') { console.error('Expected @bufbuild/protoc-gen-es $(PROTOC_GEN_ES_VERSION), found ' + v + '. Run make setup.'); process.exit(1); } } catch (e) { console.error('Missing @bufbuild/protoc-gen-es. Run make setup.'); process.exit(1); }"

generate:
	$(MAKE) check-protoc-gen-es-version
	npm run generate --src="$(PROTO_REMOTE_INPUT)"
	npm run build

generate-local:
	$(MAKE) check-protoc-gen-es-version
	npx buf generate $(LOCAL_PROTO_DIR)
	npm run build

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
