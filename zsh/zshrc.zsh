umask 0027

export LC_ALL=en_US.UTF-8
source ~/.dotfiles/zsh/functions/git-functions.zsh
source ~/.dotfiles/zsh/env.zsh
[[ -f ~/.dotfiles/zsh/secrets.zsh ]] && source ~/.dotfiles/zsh/secrets.zsh
# source ~/.dotfiles/work/work.zsh

# History configuration
HISTFILE="$HOME/.zsh_history"
HISTSIZE=50000
SAVEHIST=10000
setopt extended_history hist_expire_dups_first hist_ignore_dups hist_ignore_space hist_verify share_history

# Key bindings
bindkey -e
bindkey '^[[A' up-line-or-search
bindkey '^[[B' down-line-or-search
bindkey '^[[3~' delete-char
bindkey '^[3;5~' delete-char

# Completion configuration
autoload -Uz compinit
compinit -C

# install antidote for zsh plugin management
source $(brew --prefix)/opt/antidote/share/antidote/antidote.zsh
source <(antidote init)
antidote bundle < ~/.dotfiles/zsh/zsh_plugins.txt

if command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
else
  fpath+=("$(brew --prefix)/share/zsh/site-functions")
  source ~/.dotfiles/zsh/pure.zsh
fi
source ~/.dotfiles/zsh/alias.zsh


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

eval "$(pyenv init -)"

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR=$(brew --prefix sdkman-cli)/libexec
[[ -s "${SDKMAN_DIR}/bin/sdkman-init.sh" ]] && source "${SDKMAN_DIR}/bin/sdkman-init.sh"

. "$HOME/.local/bin/env"
