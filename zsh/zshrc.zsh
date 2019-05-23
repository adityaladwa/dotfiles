ZSH_THEME="robbyrussell"

source ~/.dotfiles/zsh/functions/git-functions.zsh
source ~/.dotfiles/zsh/alias.zsh
source ~/.dotfiles/zsh/env.zsh
source ~/.dotfiles/zsh/options.zsh
source ~/.dotfiles/zsh/alias.zsh
source ~/.nix-profile/etc/profile.d/nix.sh
source /run/current-system/sw/bin
source <(antibody init)
antibody bundle < ~/.dotfiles/zsh/zsh_plugins.txt