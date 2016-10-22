# connectfour

### Features

+ Sailsjs backend, database persistence via waterline and MySQL
+ Connect Four opponent has two difficulty settings (easy/hard)
+ Connect Four opponent uses minmax algorithm (shoutout to Lukas Vermeer for algorithmic inspiration)
+ At the bottom of the app is a table showing the ten most recent games on the app, and it gets updated in real-time via websockets!

### Install

+ Make sure you have npm and node installed ( check with node -v and npm -v, if you don't have them, install with homebrew to avoid using sudo when installing npm packages)
+ Install mysql if you don't have it, then fire up a server `mysql.server start`
+ Install sails globally `npm -g install sails`
+ clone the project from github
+ run `npm install` in the project directory
+ now the fun begins, run `sails lift` in the project directory, navigate to localhost:1337 and you should be good
