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
node revert_screen.js $@

echo 'Excuting random_score.js ...'
node random_score.js $@
