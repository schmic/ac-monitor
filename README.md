## About
AC-Monitor is a really time web-application to configure, run and monitor multiple 
instances of [Assetto Corsa](http://store.steampowered.com/app/244210) [Servers](https://steamdb.info/app/302550/).

In the case you found any bugs or problems please open an [issue](https://github.com/schmic/acMonitor/issues).
I would be happy to merge your [pull-requests](https://help.github.com/articles/creating-a-pull-request) as well.

## Requirements
#### Software
 * Working [NodeJS](http://nodejs.org/download/) installation
 * [npm](https://www.npmjs.org/) integrated into your NodeJS
 * Add NodeJS installation path to your PATH variable
 * `Assetto Corsa` or `Assetto Corsa Dedicated Server` installed via Steam or [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)
    * See the [acMonitor-Wiki](https://github.com/schmic/acMonitor/wiki) for help with SteamCMD

## Installation
* Download the [latest release](https://github.com/schmic/acMonitor/releases) of acMonitor
    * Or get the latest [development version](https://github.com/schmic/acMonitor/archive/master.zip) (*hint* might be broken)
* Extract in anywhere on your system
* Open a shell/dos-box and change into your `acMonitor` folder
* install NodeJS modules by executing:
    > npm install

## Configuration

Currently you need to restart acMonitor (and all AC servers) to activate a new configuration.

The following steps should be done by editing the `default.json` file in the config directory.

#### AC-Server Directory
* Set the directory for `AC.installpath` to refer to your Assetto Corsa Server directory
    * On Windows you **must** use double backslashes when setting your path!
    * might be relative or absolute path
    
#### Host & Port
* Change `http.host` and `http.port`
    * `http.host` must be the same as your Steam-API-Key `domainname`
    * must be a valid `hostname` on your system (`localhost` is valid as well)
     
#### Steam-API-Key
* Go to [http://steamcommunity.com/dev/apikey](http://steamcommunity.com/dev/apikey)
* Log in with your Steam-Account
* Enter your `domainname` and click `register`
* Copy & Paste your new Steam-API-Key into your configuration file

#### Admins
* For each user you want to allow admin rights enter his/her Steam-GUID and his/her name
* The Steam-GUID can be found on the Profile-page after logging in

## Running

#### Windows
    > .../bin/start.bat
    
#### Linux
    > .../bin/start.sh

## Screenshots
![acMonitorScreenshot](https://thumb6.wuala.com/previewImage/schmic/VR/AC/acMonitor/acMonitor_Admin_Servers.png/)
![acMonitorScreenshot](https://thumb6.wuala.com/previewImage/schmic/VR/AC/acMonitor/acMonitor_Admin_Presets.png/)
![acMonitorScreenshot](https://thumb6.wuala.com/previewImage/schmic/VR/AC/acMonitor/acMonitor_Admin_Tracks.png/)

## acCtrl
**TODO**
