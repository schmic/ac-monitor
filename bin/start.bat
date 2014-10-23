@echo off

set NODE_ENV=production
cd %~dp0\..
node acMonitor.js
