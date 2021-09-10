ZSH_THEME="robbyrussell"

export LC_ALL=en_US.UTF-8
source ~/.dotfiles/zsh/functions/git-functions.zsh

source ~/.dotfiles/zsh/alias.zsh
source ~/.dotfiles/zsh/env.zsh
source ~/.dotfiles/zsh/options.zsh
source ~/.dotfiles/zsh/alias.zsh
source ~/.dotfiles/work/work.zsh

source <(antibody init)
antibody bundle < ~/.dotfiles/zsh/zsh_plugins.txt

source ~/.dotfiles/zsh/pure.zsh

source /Users/adityaladwa/.config/broot/launcher/bash/br

export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion