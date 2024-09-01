ZSH_THEME="robbyrussell"

export LC_ALL=en_US.UTF-8
source ~/.dotfiles/zsh/functions/git-functions.zsh
source ~/.dotfiles/zsh/alias.zsh
source ~/.dotfiles/zsh/env.zsh
# source ~/.dotfiles/work/work.zsh

source <(antibody init)
antibody bundle < ~/.dotfiles/zsh/zsh_plugins.txt

fpath+=("$(brew --prefix)/share/zsh/site-functions")
source ~/.dotfiles/zsh/pure.zsh


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

eval "$(pyenv init --path)"

## [Completion]
## Completion scripts setup. Remove the following line to uninstall
[[ -f /Users/aditya/.dart-cli-completion/zsh-config.zsh ]] && . /Users/aditya/.dart-cli-completion/zsh-config.zsh || true
## [/Completion]

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR=$(brew --prefix sdkman-cli)/libexec
[[ -s "${SDKMAN_DIR}/bin/sdkman-init.sh" ]] && source "${SDKMAN_DIR}/bin/sdkman-init.sh"
