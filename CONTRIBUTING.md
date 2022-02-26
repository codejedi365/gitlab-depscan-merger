# CONTRIBUTORS

## Issues & PR's

Please fill out associated templates clearly and as detailed as possible for the
requested actions. It is important that you articulate WHAT you are trying to do
and WHY so your request will be considered. Before submission, search and review
all open and previously closed tickets before opening another one. This saves
everyone time!

## Development Environment

### Option 1 (**RECOMMENDED**)

-   VSCode & associated devcontainer environment (ext:
    `ms-vscode-remote.remote-containers`) This project will auto-install and
    configure repository and only requires Docker.

### Option 2

-   Use `nvm` for node version management (see `.nvmrc` for version requirement)
-   Use latest npm version via `nvm install-latest-npm`
-   Recommend VSCode & the extensions: ESLint, editorconfig
-   Upon `clone`, this project will be configured to require GPG signatures for
    commits.

### All Options (**REQUIRED**)

You will need to
[create a GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
with your validated GitHub email address and configure `git` to use it with the
following command:

```sh
# REF: https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key
git config --local user.signingkey <GPG_KEY_ID>
```

## Guidelines

-   Code (including Markdown) must pass a linting checks
-   Development environment expectation is NodeJS v16 LTS & `npm@^7.0.0`
-   Must have successful build & pass all test cases in both Node.js v12 LTS,
    v14 LTS, & v16 LTS
-   Distribution build must be compatible with oldest supported LTS version (`v12`)
-   New features & bugs should include a Test Driven Development (TDD) test case
    that replicates the issue or tests the new feature
-   Code Coverage is expected to be maintained
-   Versioning & releases are handled by CI/CD & semantic versioning construct
    which relies upon semantic commits. We use git hooks with commitizen &
    commitlint to help faciliate contributors.
-   Commits should be GPG signed with a GitHub validated email address

## Tools

1. **Git Hooks** (autoconfigured on install with Husky)

2. **Semantic commits**: Commitizen interactive commit msg creation, with
   `commitlint` verification

3. **Jest Unit Testing**: Verification exported functions w/ coverage

4. **Jest System Testing**: External CLI interface testing of input report
   to output report creation to validate full library input to output results.

5. **Typescript-eslint**: Full codebase linting for TS, JS, JSON, & Markdown files

## Testing

### Local Testing

```sh
# Runs all jest testing projects
npm test

# or separately
npm run test:unit         # unit tests
npm run test:system       # system test

# interactive
npm run watch             # run unit-tests in watch mode

# Lint (add ':file -- <filename>' for specific files)
npm run lint              # evaluates entire repository
npm run format            # autofix code
```

### GitHub CI Pipeline

Upon an open Pull Request (PR), GitHub will automatically run the configured CI
actions in order to evaluate and enforce the project standards. You can review
the action steps at `.github/workflows/cicd.yml`. The actions will line up with
the guidelines stated above. PR's will not be accepted until there are no merge
conflicts with the master branch nor failing pipeline actions. Please do your
due diligence.
