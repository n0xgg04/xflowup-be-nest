#! /bin/bash
nest build && 
tsc -p tsconfig.build.json && 
cp -r src/mail/template dist/src/mail/

