# SSH Known Hosts Install Script

_Configures SSH Known Hosts for all users._

**Script status**: In development

**OS support**: Debian 9+, Ubuntu 18.04+, and downstream distros.

**Maintainer:** codejedi365

## Syntax

```text
./known-hosts-debian.sh [domain|ip[:port]]
```

| Argument             | Default         | Description                                                                                                                              |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `domain\|ip [:port]` | `github.com:22` | The connection definition of either a domain name or IP and the associated port. Do not include spaces. Port 22 is assumed if not given. |

## Usage

### Script use

1. Add [`known-hosts-debian.sh`](../known-hosts-debian.sh) to `.devcontainer/library-scripts`

2. Add the following to your `.devcontainer/Dockerfile`:

   ```Dockerfile
   COPY library-scripts/known-hosts-debian.sh /tmp/library-scripts/
   RUN apt-get update && bash /tmp/library-scripts/known-hosts-debian.sh
   ```

3. Make sure `vars.env` contains the host key you intend to install. It should use the naming
   convention `[DOMAIN]_SSH_HOST_KEY_[TYPE]`, where `domain` is uppercase and has no periods, and
   type is the algorithm type of either `ECDSA` or `RSA`.

If you have already built your development container, run the **Rebuild Container** command from the
command palette (<kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>F1</kbd>) to pick up
the change.

That's it!
