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
2. Generate the changelog section. From this repo's root, run `../scalekit-sdks-wrapper/scripts/changelog/generate.sh node <version>` if the wrapper repo is checked out next to this one, or `../../scripts/changelog/generate.sh node <version>` if this repo is the wrapper's `sdks/node` submodule. Review the section, then commit `CHANGELOG.md` in the release PR. If proto or generated API files changed, extra generation steps apply. Those steps are not documented yet. Do not invent them. Ask before you regenerate.
3. Merge the release branch to `main`.
4. Create a git tag that matches the version (`v2.12.0` for `2.12.0`). Draft a GitHub Release for that tag. Use the new `CHANGELOG.md` section, verbatim, as the release body.
5. Publishing does not start on its own. Open the Actions run for the release workflow. Any peer can approve it. The `release` environment gates deploy.
6. After approval, the workflow publishes to npm.

PR titles must be Conventional Commits with the Linear ticket at the end (`feat(users): add search_users (SK-2101)`), never a `[SK-####] ` prefix. PRs are squash-merged, so the title becomes the commit on `main` that the changelog is built from.

<!-- MANUAL ADDITIONS END -->
