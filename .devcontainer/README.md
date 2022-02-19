# VSCode Remote Containers (`.devcontainer`)

This folder is build for integration into VSCode's Remote Container's extension which will create an
isolated/containerized development environment for the project with all the expected development
tools installed automatically.

## Prerequists

1.  VSCode
2.  VSCode Extension: `ms-vscode-remote.remote-containers` installed & enabled globally
3.  Docker Desktop/Docker Engine installed locally

## Notes

1.  For the best IO experience, cloning the repository into the remote container performs much
    better than a bind mount across the host to the container. Install's and file modifications
    (lint & formatting) will take longer. VSCode will create a separate volume for the repository to
    reside that is separate from the container's core volume which means it is not tied to the
    overall dev container image. To clone use the VSCode Palatte command:
    `Remote-Containers: Clone Repository in Named Container Volume` and follow the prompts. As a
    word of caution, do not delete the `vsc-remote-containers` volume without pushing your changes
    to the repository or they will be lost.

2.  Docker is extending support for its own devcontainers feature on Docker Desktop, however this is
    not the same as VSCode DevContainers. We rely upon the features defined in `.devcontainer.json`
    to configure and set up the support of Docker Compose to the local docker socket and GPG key
    agent configuration, neither of which are trivial tasks. If you do not heed this warning,
    godspeed.

## FAQ

1. **There seems to be git history that is missing, how do I fix that?** This can happen internally
   when building/cloning a repository into a separate volume if a repository is cloned with a
   `depth=1`. It is easy to fix with the following:

   ```sh
   rm -f .git/shallow.lock
   git pull --unshallow
   ```
