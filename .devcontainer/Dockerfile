# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.209.6/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

COPY ./library-scripts/*.sh ./library-scripts/*.env /tmp/library-scripts/

RUN apt update && export DEBIAN_FRONTEND=noninteractive \
    # remove pre-installed yarn (from javascript-node base image) to
    # prevent developer confusion/misuse, this repo expects npm
    && apt remove -y yarn \
    # && apt -y install --no-install-recommends <your-package-list-here>
  
    # Ensure github:22 is a known-host
    && bash /tmp/library-scripts/known-hosts-debian.sh "github.com" \
    # Cleanup
    && apt autoremove -y && apt-get clean -y && rm -rf /tmp/library-scripts
