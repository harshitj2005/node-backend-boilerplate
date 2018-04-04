'use strict';

/**
 * Module dependencies.
 */
require('app-module-path').addPath(__dirname);
var express     = require('express');
var fs          = require('fs');

// Load Configurations
var config          = require('config/config.js');
var winston         = require('config/winston');

winston.info('Config loaded: '+config.NODE_ENV);

var db              = require('config/sequelize');

var app = express();

//Initialize Express
require('config/express')(app);

//Start the app by listening on <port>
app.listen(config.PORT);
winston.info('Express app started on port ' + config.PORT);

//expose app
module.exports = app;
