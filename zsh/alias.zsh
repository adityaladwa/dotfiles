# Visual CLI Tools (Omarchy style)
if command -v eza >/dev/null 2>&1; then
  alias ls='eza --icons --group-directories-first'
  alias ll='eza -l --icons --group-directories-first'
  alias la='eza -la --icons --group-directories-first'
  alias lt='eza --tree --level=2 --icons'
else
  alias ll='ls -l'
  alias la='ls -la'
fi

if command -v bat >/dev/null 2>&1; then
  alias cat='bat --paging=never --style=plain'
fi
alias vim="nvim"

# Git
alias gs='git status'
alias gd='git diff'
alias glrd='git pull --rebase origin develop'
alias gds="git diff --staged"

#Python
# alias pip="pip3"
# alias python="python3"
