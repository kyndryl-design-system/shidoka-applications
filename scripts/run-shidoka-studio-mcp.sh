#!/usr/bin/env bash
# Launcher for the Shidoka Studio MCP server.
#
# Cursor's GUI process often inherits a minimal PATH that does not include
# nvm/fnm/asdf-managed node. This script sources the appropriate hooks
# before exec-ing the server so the MCP starts reliably.
#
# Installed by: npx shidoka-studio-install-rule

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
elif command -v fnm &>/dev/null; then
  eval "$(fnm env)"
elif [ -s "$HOME/.fnm/fnm" ]; then
  eval "$("$HOME/.fnm/fnm" env)"
elif [ -s "$HOME/.asdf/asdf.sh" ]; then
  . "$HOME/.asdf/asdf.sh"
fi

exec node ./node_modules/@kyndryl-cto/shidoka-studio/bin/server.js "$@"
