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

## Release

Package: `@scalekit-sdk/node` on npm. Workflow: `.github/workflows/release.yml`.

1. Bump the version in `package.json` and `package-lock.json`. Use a minor or patch bump.
2. Review the unreleased changes. If proto or generated API files changed, extra generation steps apply. Those steps are not documented yet. Do not invent them. Ask before you regenerate.
3. Merge the release branch to `main`.
4. Create a git tag that matches the version (`v2.12.0` for `2.12.0`). Create and publish a GitHub Release for that tag.
5. After publication, the Release workflow starts automatically. Open the Actions run and obtain approval for the `release` environment.
6. After approval, the workflow publishes to npm.

<!-- MANUAL ADDITIONS END -->
