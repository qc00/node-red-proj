#!/bin/bash
set -e
remote=root@venus.local:/data/home/nodered/.node-red/projects/Github/
# https://ss64.com/bash/rsync.html
function rs() {
    /opt/homebrew/bin/rsync -vrtc --delete --update "${@:3}" --exclude='*' $1 $2 | egrep -v '^(Transfer|sent|total|receiving|sending) '
}

echo -e "\033[32m←\033[0m" Getting current flow from remote
rs $remote ./ --backup-dir=.backup --exclude="*.ts" --exclude="*.sh" --exclude="tsconfig.json" --exclude="coord.json" --include='?*.*'

git add *.js # Save state before compiling

echo -e "\033[97;104mTS\033[0m"
node_modules/.bin/tsc
# Strip the function wrapper from ts:
for ts in *.ts ; do
    js="${ts/%ts/js}"
    if [[ -f $js ]] && [[ "`head -n 1 $js`" = function\ * ]] ; then
        echo Stripping $js
        sed -e '1d; $d; s/^    //' -i '' $js
    fi
done

echo -e "\033[32m→\033[0m" Sending changes # Should be the logical complement of above
rs ./ $remote --include=package.json --include="/*.ts" --include=qess --include='/qess/*.*' --chown=nodered:nodered

git status -s *.js
