#!/usr/bin/env bash
#-------------------------------------------------------------------------------------------------------------
# Docs: https://github.com/HunterDevOps/scout/.devcontainer/library-scripts/docs/known-hosts.md
# Maintainer: codejedi365
#
# Syntax: ./known-hosts-debian.sh [domain[:port] ... ]
#-------------------------------------------------------------------------------------------------------------

REMOTE_SSH_HOST="${1:-github.com}"
REMOTE_SSH_HOST="${REMOTE_SSH_HOST%:22}"
ENV_VARS_FILE="$(dirname "$(realpath "$0")")/vars.env"

if [ -f "$ENV_VARS_FILE" ]; then
  # shellcheck source=.devcontainer/library-scripts/vars.env
  . "$ENV_VARS_FILE"
fi

add_known_host_key() {
  local host="$1"
  local hostfile="${2:-'/etc/ssh/ssh_known_hosts'}"
  local domain="${host%:*}"

  domain="$(printf '%s' "$domain" | awk '{print toupper($0)}' | sed 's/\.//g')"

  if printf '%s' "$host" | grep -qE ".+:[0-9]{1,5}$"; then
    host="[$host]"
  fi

  local HOST_KEY_VAR_ECDSA="${domain}_SSH_HOST_KEY_ECDSA"
  local HOST_KEY_VAR_RSA="${domain}_SSH_HOST_KEY_RSA"

  if [ -n "${!HOST_KEY_VAR_ECDSA}" ]; then
    printf '%s\n' "$host ${!HOST_KEY_VAR_ECDSA}" >> "$hostfile"

  elif [ -n "${!HOST_KEY_VAR_RSA}" ]; then
    printf '%s\n' "$host ${!HOST_KEY_VAR_RSA}" >> "$hostfile"

  fi
}

config_proxied_domain_host() {
  local domain="${1%:*}"
  mkdir -v /etc/ssh/ssh_config.d
  local conf_entry="\
Host $domain\n\
  HostName $domain\n\
  CheckHostIP no\n\
"
  sh -c "umask 0033 && printf '%b\n' \"$conf_entry\" >> /etc/ssh/ssh_config.d/servers.conf"
}

hash_known_hosts_file() {
  local filename="${1:-'/etc/ssh/ssh_known_hosts'}"
  ssh-keygen -H -f "$filename" \
    && rm "${filename}.old" \
    && chmod 444 "$filename"
}

add_known_host_key "$REMOTE_SSH_HOST" "/etc/ssh/ssh_known_hosts"
hash_known_hosts_file "/etc/ssh/ssh_known_hosts"
config_proxied_domain_host "$REMOTE_SSH_HOST"
