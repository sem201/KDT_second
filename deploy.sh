#!/bin/bash
source ~/.bash_profile

cd ~/moim
git pull origin main
npm i
pm2 start app.js