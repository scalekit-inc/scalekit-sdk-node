# scalekit-sdk-node Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-15

## Active Technologies

- TypeScript 5.x (documentation target; examples mus + @scalekit-sdk/node v2.2.0 (the SDK being (001-sdk-reference-docs)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x (documentation target; examples mus: Follow standard conventions

## Recent Changes
- 001-sdk-reference-docs: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

- 001-sdk-reference-docs: Added TypeScript 5.x (documentation target; examples mus + @scalekit-sdk/node v2.2.0 (the SDK being

<!-- MANUAL ADDITIONS START -->

## Release notes and releases

- Releases and cross-SDK changes are driven from scalekit-sdks-wrapper (`/sdk`, `/sdk-release`).
  Its release tool (`python3 tools/release/release.py --sdk <lang> ...`, run from the wrapper)
  writes release-notes fragments into `.changes/unreleased/`, bumps the version and renders
  `CHANGELOG.md`. Notes follow the wrapper's `standards/release-notes.md`.
- Never hand-edit the SDK version or `CHANGELOG.md` sections.
- `.github/workflows/release.yml` publishes a version after its release PR has merged. It is
  started with that version (by Claude from the wrapper, or by a maintainer), and waits for a
  human approval on the `release` environment from someone other than the person who started
  it. The workflow is generated in the wrapper; don't edit it here.
