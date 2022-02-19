#!/bin/sh
# FILE: postattach.sh
# -----------------------------------

[ -z "$LOG_PREFIX" ] && LOG_PREFIX="[post-attach]"

PROJECT_DIR=""
if ! PROJECT_DIR="$(git rev-parse --show-toplevel)"; then
    printf >&2 '%s\n' "$LOG_PREFIX ERROR: something bad happened."
fi

# shellcheck source=.husky/hook-utils.sh
. "$PROJECT_DIR/.husky/hook-utils.sh"

# for devcontainers, its best to use ssh to contact origin since HTTPS requires user auth
# which is not easy to setup from within a container
config_git_ssh_origin() {
    output=""
    if ! output="$(git config --local --get remote.origin.url)"; then
        error "FATAL ERROR: Cannot find remote origin url."
        unset -v output
        return 1
    elif replay "$output" | grep -q "git@github.com:"; then
        unset -v output
        return 0
    fi
    ORIGIN_ORIGINAL_URL="$output"
    unset -v output

    # check ssh to github.com is configured, github throws exit 1 so just check message for desired message
    if ! ssh -Tq git@github.com 2>&1 1>/dev/null | grep -q "successfully authenticated"; then
        error "**** WARNING: SSH NOT CONFIGURED FOR GITHUB ****"
        error "**** FAILED COMMAND: ssh -T git@github.com ****"
        error "remote.origin.url='$ORIGIN_ORIGINAL_URL'"
        unset -v ORIGIN_ORIGINAL_URL
        return 0
    fi

    # make new url
    ORIGIN_SSH_URL="git@github.com:${ORIGIN_ORIGINAL_URL#*github.com/}"

    if ! git config --local remote.origin.url "$ORIGIN_SSH_URL"; then
        error "Failed to swap origin url to the ssh equivalent."
        unset -v ORIGIN_ORIGINAL_URL ORIGIN_SSH_URL
        return 1
    fi
    if ! git fetch origin >/dev/null 2>&1; then
        error "Failed to fetch from origin using an ssh url"
        error "Reseting origin url to original path."
        if ! git config --local remote.origin.url "$ORIGIN_ORIGINAL_URL"; then
            error "ERROR: Failed to reset origin to original url."
            return 1
        fi
    fi
    log "SUCCESS: Swapped origin to point at $ORIGIN_SSH_URL"
    unset -v ORIGIN_ORIGINAL_URL ORIGIN_SSH_URL
}

VALID_GIT_CONFIG="true"

# [1] Validate git configuration is intact
if ! config_git_project_gitconfig; then
    VALID_GIT_CONFIG="false"
fi
if ! config_git_commit_signing; then
    VALID_GIT_CONFIG="false"
fi
if ! config_git_ssh_origin; then
    VALID_GIT_CONFIG="false"
fi
if [ "$VALID_GIT_CONFIG" = "true" ]; then
    log "SUCCESS: verified git config"
fi

unset -v PROJECT_DIR VALID_GIT_CONFIG
unset -f config_git_ssh_origin
cleanup
