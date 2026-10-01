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

- Every PR that changes shipped code adds a release-notes fragment:
  `python3 scripts/release/release.py new --kind <added|changed|deprecated|removed|fixed|security> --ticket SK-1234 --body "..."`
  (or `changie new`). Write it for the developer upgrading; rules are in
  scalekit-sdks-wrapper `standards/release-notes.md`.
- Label every PR `release` or `skip-release` (`no-changelog` only when nothing shipped
  changes). The `release-notes` check enforces the label, the version and CHANGELOG rules.
- Never hand-edit the SDK version or `CHANGELOG.md`. A releasing PR runs
  `python3 scripts/release/release.py prepare`, which computes the version from the
  fragments, bumps every location in `release.toml` and renders the section.
- Merging a version bump to `main` starts `.github/workflows/release.yml`. It builds and
  tests, then waits for a human approval on the `release` environment (someone other than
  the person who merged) before tagging and publishing.
- Cross-SDK changes and release-only runs: `/sdk` and `/sdk-release` from
  scalekit-sdks-wrapper. Never edit `scripts/release/` or the release workflows here; they
  are vendored from that repo.
