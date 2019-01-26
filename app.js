"use strict";

/**
 * Module dependencies.
 */
require("app-module-path").addPath(__dirname);
let express = require("express");
const helmet = require("helmet");

// Load Configurations
let config = require("config/config.js");
let winston = require("config/winston");
const addRequestId = require("express-request-id")();

//load database
let db = require("config/sequelize");  // eslint-disable-line
winston.info("Config loaded: "+config.NODE_ENV);

var app = express();

//restart application in case of uncaught exception
process.on("uncaughtException", function (err) {
    winston.error("uncaughtException", err.stack);
    process.exit(1)
});

// Generate UUID for request and add it to X-Request-Id header.
// In case request contains X-Request-Id header, uses its value instead
app.use(addRequestId);
//Initialize Express
require("config/express")(app);

app.use(helmet());
app.use(helmet.noCache())
// Setting Up Headers -- Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Accept");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
    // Pass to next layer of middleware
    next();
});
//Start the app by listening on <port>
app.listen(config.PORT);
winston.info("Express app started on port " + config.PORT);
//set timeout of the app requests
app.timeout = 25000;
//expose app
module.exports = app;
