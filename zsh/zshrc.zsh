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

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/adityaladwa/Downloads/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/adityaladwa/Downloads/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/adityaladwa/Downloads/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/adityaladwa/Downloads/google-cloud-sdk/completion.zsh.inc'; fi
