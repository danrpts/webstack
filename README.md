# webstack

A lightweight webstack for Javascript SPAs. Built on top of Node, Gulp, Express, Backbone and MDL with selected patterns. This is a project for experimental and educational purposes. Feedback, tests and pull requests are welcomed.

## Install
	  
    git clone https://github.com/danrpts/webstack.git
    cd webstack
    npm install -g gulp express
    npm install

## Build the tasks client

    gulp -c webtasks

The project is now being watched for changes

## Start

    npm start
    
The application is now hosted at http://localhost:3000

## Authentication

When authenticating with Google OAuth2 you must update the "client id" and/or "client secret" in the /webserver/config/google_config.json and /webclient/[app name]/javascripts/config/google.json files.

## Client Screenshots
![List](https://raw.github.com/danrpts/webstack/master/screenshots/ScreenShotList.png)
![Card](https://raw.github.com/danrpts/webstack/master/screenshots/ScreenShotCard.png)
