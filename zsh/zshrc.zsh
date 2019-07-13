ZSH_THEME="robbyrussell"

export LC_ALL=en_US.UTF-8
source ~/.dotfiles/zsh/functions/git-functions.zsh

source ~/.dotfiles/zsh/alias.zsh
source ~/.dotfiles/zsh/env.zsh
source ~/.dotfiles/zsh/options.zsh
source ~/.dotfiles/zsh/alias.zsh

source <(antibody init)
antibody bundle < ~/.dotfiles/zsh/zsh_plugins.txt

source ~/.dotfiles/zsh/pure.zsh
