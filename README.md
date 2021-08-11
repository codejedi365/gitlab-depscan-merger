# GitLab Dependency Scan Report Merger

<p align="center">
  <a href="https://www.npmjs.com/package/@codejedi365/gitlab-depscan-merger">
    <img src="https://img.shields.io/npm/v/@codejedi365/gitlab-depscan-merger" />
  </a>
  <img src="https://img.shields.io/npm/l/@codejedi365/gitlab-depscan-merger?color=yellow">
  <a href="https://github.com/codejedi365/gitlab-depscan-merger/blob/main/CHANGELOG.md">
    <img src="https://img.shields.io/badge/&#9741-changelog-yellow">
  </a>
  <a href="https://github.com/codejedi365/gitlab-depscan-merger/actions/workflows/ci.yml">
    <img src="https://github.com/codejedi365/gitlab-depscan-merger/actions/workflows/ci.yml/badge.svg" >
  </a>
  <a href="https://github.com/codejedi365/gitlab-depscan-merger/issues">
    <img src="https://img.shields.io/github/issues/codejedi365/gitlab-depscan-merger">
  </a>
  <img src="https://img.shields.io/badge/dependencies-0-success">
  <img src="https://img.shields.io/snyk/vulnerabilities/npm/@codejedi365/gitlab-depscan-merger">
</p>
<p align="center">
  <img src="https://img.shields.io/npm/dependency-version/@codejedi365/gitlab-depscan-merger/dev/webpack">
  <img src="https://img.shields.io/node/v-lts/@codejedi365/gitlab-depscan-merger?color=blue">
  <img src="https://img.shields.io/bundlephobia/min/@codejedi365/gitlab-depscan-merger" />
  <img src="https://img.shields.io/github/last-commit/codejedi365/gitlab-depscan-merger">
</p>

    Usage: gitlab-depscan-merger [-o file] <files...>

    Input: 
      <files> list of filenames space-delimited

    Options:

      -V, --version     output the version number
      -o, --out <path>  output filename, defaults to gl-dependency-scanning-report.json
      -h, --help        output usage information

## Package Objective

Merges multiple dependency_scanning schema results into 1 report! Ideal for
multi-pkg scan results in a CI pipeline when you have multiple packages in
one repository which has a single pipeline.  This can occur when:

1. Maintaining both a frontend TS/JS package and a backend NodeJS server. (2x npm audit results)
2. A TS/JS monorepo which maintains multiple npm packages like with `lerna`.
3. A large monorepo with multiple programming languages and dependency managers

This package will correctly combine multiple preformatted schema reports into a
single report to be ingested into the GitLab artifacts reporter.

**IMPORTANT: This will only ingest correctly formatted reports. It will not perform**
**a translation of external tool reports into the proper format and merge.**

To preformat your dependency scan report from an security scanning tool, you must use
another library to do so. Some libraries are:
- [gitlab-npm-audit-parser](https://npmjs.com/@codejedi365/gitlab-npm-audit-parser)

## Why?

GitLab CI/CD Pipelines only support uploading of a single dependency_scanning
report within a pipeline. It resorts to the last provided artifact within the
pipeline. This becomes problematic when you have multiple languages in a single
repository which require different dependency audit scanners.  This also is an
issue when having multiple packages in a single monorepo.  Each package has its
own dependency tree that should be scanned. Furthermore, for an effective and
fast CI/CD pipeline you will want these jobs to run independently of each other
and report their results accordingly. This becomes impossible given the GitLab
`artifacts::reports::dependency_scanning` upload limitation. The complex schema
also prevents an easy merge of multiple scan reports. **This repository solves
this problem for you!**

Just add a `.post` stage and import the regular report artifacts from the other
previous audit stages and run this package.  It will consolidate your single
GitLab Dependency Scanning reports into a single report that matches the
standard dependency audit schema. This new report can be singularly ingested
and the artifact will be parsed to generate interactive content embedded in a
pipeline results view or Merge Request (MR) webpage.

**Why this library?** Because it's fast! We used
[Webpack](https://github.com/webpack/webpack) to generate a self-contained
bundle which means we have **0 dependencies** to download for production! With
NPX you can use this library direct from the cloud with minimal delay at ______KB
package size. We use Gitlab's published schema repository directly to help
construct the output code. For Developers, we also employ linting & automated
testing on the codebase to improve the development experience.

## Compatibility

| INGEST (Multiple JSON files)               |        | OUTPUT (1x JSON file)                                  |
| ------------------------------------------ | :----: | ------------------------------------------------------ |
| dependency-scanning-report-format\@v14.x.x |   =>   | dependency-scanning-report-format\@v14.0.3             |

GitLab.org publishes their security report format to their own Package
Repository which is attached to their schema generation repository:
[gitlab-org/security-report-schemas](https://gitlab.com/gitlab-org/security-products/security-report-schemas).
This project targets the currently released report-format for Dependency
Scanning.  The input file must pass a `jsonschema` validation against the GitLab
Dependency Scanning report format schema to be processed & merged by this
package.

## How to use

Install this package into your devDependencies or use `npx` directly to download
the package at runtime. 

_I recommend the runtime option since this package is only needed in a GitLab
specific pipeline and not necessary to be locally installed for developer use._

```sh
# 1. Downloads at runtime use
npx gitlab-depscan-merger -o gl-dependency-scanning.json <files>

# 2. Install in devDependencies
npm install --save-dev gitlab-depscan-merger
```

### Example CI/CD pipeline configuration 

```yaml
# FILE: .gitlab-ci.yml
# [...]
pkg1_depscan:
  stage: security
  when: always
  script:
    - npm audit --json | npx @codejedi365/gitlab-npm-audit-parser -o scan1.json
  artifacts:
    when: always
    paths:
      - scan1.json

pkg2_depscan:
  stage: security
  when: always
  script:
    - npm audit --json | npx @codejedi365/gitlab-npm-audit-parser -o scan2.json
  artifacts:
    when: always              # even if npm audit causes exitcode failure, you still want the artifact to be uploaded
    paths:
      - scan2.json

consolidate_depscans:
  stage: .post                # always last stage
  image: node:lts-alpine
  when: always                # should always run to consolidate results especially when a vul is found
  needs:
    - job: pkg1_depscan
      artifacts: true
    - job: pkg2_depscan
      artifacts: true
  variables:
    DEPSCAN_REPORT: gl-dependency-scanning.json
  script:
    - npx gitlab-depscan-merger
      -o $DEPSCAN_REPORT
      scan1.json
      scan2.json
  artifacts:
    reports:
      dependency_scanning: $DEPSCAN_REPORT
```

## Vulnerability Report

| Vulnerability |     PKG      | Category |     In Production Pkg?      | Notes                                                                 |
| ------------- | :----------: | :------: | :-------------------------: | --------------------------------------------------------------------- |
| RegExp DoS    | trim\@<0.0.3 |   High   | No _(DevDependency/Linter)_ | waiting for remark-parse\@^9.x.x release, owner will not patch v8.0.3 |

## Contributors

PR's & Issue contributions welcome! Please adhere to [contributing guidelines](https://github.com/codejedi365/gitlab-depscan-merger/blob/main/CONTRIBUTING.md) or your submission will be closed.

<!-- ## Future Features -->
<!-- ## Extras -->

Check out my other projects at [@codejedi365](https://github.com/codejedi365) on
GitHub.com
