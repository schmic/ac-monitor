@echo off

set NODE_ENV=production
cd %~dp0\..
forever -l forever.log -o stdout.log -e stderr.log -a -c iojs acMonitor.js
