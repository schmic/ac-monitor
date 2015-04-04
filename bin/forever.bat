@echo off

set NODE_ENV=production
cd %~dp0\..
forever -o stdout.log -e stderr.log -a acMonitor.js
