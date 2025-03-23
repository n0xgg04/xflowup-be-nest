#! /bin/bash
mkdir -p dist/src/mail dist/public &&
cp -r src/mail/template dist/src/mail/ &&
cp -r public dist/public &&
nest start --watch