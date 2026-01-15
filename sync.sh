#!/bin/bash
set -e -o pipefail
remote=venus:/data/home/nodered/.node-red

# Distribute modules only
if [[ ! $PWD -ef `dirname $0` ]] ; then
    node_modules/.bin/tsc

    exec scp -r package.json dist $remote/`basename $PWD`
    exit 1
fi

# https://ss64.com/bash/rsync.html
function rs() {
    /opt/homebrew/bin/rsync -vrtc --delete --update --exclude=pnpm-lock.yaml "${@:3}" --exclude=node_modules --exclude='.*' $1 $2 | egrep -v '^(Transfer|sent|total|receiving|sending) '
}

remote=$remote/projects/Github/

echo -e "\033[32m←\033[0m" Getting current flow from remote
rs $remote ./ --backup-dir=.backup --exclude="*.ts" --exclude="*.sh" --exclude="*.yaml" --exclude=tsconfig.json --exclude=qess

git add *.js # Save state before compiling

echo -e "\033[97;104mTS\033[0m"
node_modules/.bin/tsc
# Strip the function wrapper from ts:
pattern='^(function main\(|import|export)'
for ts in *.ts ; do
    js="${ts/%ts/js}"
    if [[ -f $js ]] && head -n 5 $js | egrep -q "$pattern" ; then
        echo Stripping $js
        sed -Ee "/^function main/,/^\}/ s/^(    |\})//; /$pattern/d;"'/^$/{$d;}' -i '' $js
    fi
done

echo -e "\033[32m→\033[0m" Sending changes # Should be the logical complement of above
rs ./ $remote --include='/qess/*.*' --chown=nodered:nodered

git status -s *.js
