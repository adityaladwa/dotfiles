# source ~/.zsh_plugins.sh # Load zsh plugins


# source ~/.dotfiles/zsh/functions/functions.zsh
# source ~/.dotfiles/zsh/functions/fzf-functions.zsh

ZSH_THEME="robbyrussell"

source ~/.dotfiles/zsh/functions/git-functions.zsh
source ~/.dotfiles/zsh/env.zsh
source ~/.dotfiles/zsh/options.zsh
source ~/.dotfiles/zsh/alias.zsh

autoload -U promptinit; promptinit
prompt pure

source <(antibody init)
antibody bundle < ~/.dotfiles/zsh/zsh_plugins.txt
