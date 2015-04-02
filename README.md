## About
AC-Monitor is a really time web-application to configure, run and monitor multiple 
instances of [Assetto Corsa](http://store.steampowered.com/app/244210) [Servers](https://steamdb.info/app/302550/).

In the case you found any bugs or problems please open an [issue](https://github.com/schmic/ac-monitor/issues).
I would be happy to merge your [pull-requests](https://help.github.com/articles/creating-a-pull-request) as well.

## Requirements
#### Software
 * Working [NodeJS](http://nodejs.org/download/) installation
 * [npm](https://www.npmjs.org/) integrated into your NodeJS
 * Add NodeJS installation path to your PATH variable
 * `Assetto Corsa` or `Assetto Corsa Dedicated Server` installed via Steam or [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)

## Installation
* Download the [latest release](https://github.com/schmic/ac-monitor/releases) of ac-monitor
    * Or get the latest [development version](https://github.com/schmic/ac-monitor/archive/master.zip)
* Extract in anywhere on your system
* Open a shell
* Change into your `ac-monitor` folder
* Install NodeJS modules by executing:
    > npm install --production

## Configuration

Currently you need to restart ac-monitor, which will restart all AC servers as well, to load any configuration changes.

The following steps should be done by editing the `default.json` file in the config directory.

#### AC-Server Directory
* Set the directory for `ac.path` to refer to your Assetto Corsa Server directory
    * On Windows you **must** use double backslashes when setting your path!
    * might be relative or absolute path
    
#### Host & Port
* Set `http.host` and `http.port`
    * the `host` can be an IP-address as well
    * defines `host:port` the app will listen on
     
#### Steam

##### External Host/Port
* Set `steam.url.host` and `steam.url.port` 
    * defines the hostname steam **redirects** to after login
    * should be set to the **hostname** you access the app

##### API-Key
* Go to [http://steamcommunity.com/dev/apikey](http://steamcommunity.com/dev/apikey)
* Log in with your Steam-Account
* Enter your `domainname` and click `register`
* Copy & Paste your new Steam-API-Key into your configuration file

#### Admins
* For each user you want to allow admin rights enter his/her Steam-GUID and his/her name
* The Steam-GUID can be found on the Profile-page after logging in

## Running

#### Windows
    > .../ac-monitor/bin/start.bat
    
#### Linux
    > .../ac-monitor/bin/start.sh
