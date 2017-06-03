#!/bin/sh

usage () {
    echo 'Usage : worker [brand] [cinemas]'
    exit
}

if [ "$#" -lt 2 ]
then
    usage
fi

echo 'Excuting revert_screen.js ...'
node $(dirname $0)/revert_screen.js $@

echo 'Excuting random_score.js ...'
node $(dirname $0)/random_score.js $@
