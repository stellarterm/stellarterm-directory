#!/usr/bin/env bash

#Build logos.json before commit

(cd ./source && ./buildLogos.js)
if [[ $? -eq 1 ]]; then
    echo "Error build logos.json";
    exit 1;
fi;

#Run directory.js before commit

node directory.js
if [[ $? -eq 1 ]]; then
    echo "Error with run directory.js";
    exit 1;
fi;


# Build buildInfo.json

ID="$(git rev-list --count HEAD)";
cd ./static && echo {'"buildId"': $ID} > buildInfo.json;


# Commit

COMMIT_NAME=$(openssl dgst -sha256 buildInfo.json | sed 's/^.* //');

git add .
git commit -a -m "Commit id: $COMMIT_NAME"


