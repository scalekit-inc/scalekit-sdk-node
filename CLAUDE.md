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

- Package: `@scalekit-sdk/node` on npm. Workflow: `.github/workflows/release.yml`.
- Every change that users can notice adds a release-notes file under `.changes/unreleased/`.
- Never hand-edit the version (`package.json`, `package-lock.json`) or `CHANGELOG.md`
  sections: release tooling bumps the version and renders the CHANGELOG section from those
  files.
- Publishing a GitHub Release for a merged version starts the release workflow. It waits for
  an approval on the `release` environment from someone other than the person who started
  it, then publishes to npm.

<!-- MANUAL ADDITIONS END -->
