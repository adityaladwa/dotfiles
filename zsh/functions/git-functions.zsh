function gs(){
    git status
}

function gd(){
    git diff
}

function ga(){
    git add $1
}

function gc(){
    git commit -m $1
}

function gp(){
    git push -u $1 $2
}