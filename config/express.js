'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var config = require('config/config');
var winston = require('config/winston');

module.exports = function(app) {

    app.set('showStackError', true);    
    
    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Setting the fav icon and static folder
    app.use(favicon(config.root + '/public/img/icons/favicon.ico'));
    app.use(express.static(config.root + '/public'));

    //Don't use logger for test env
    if (config.NODE_ENV !== 'test') {
        app.use(logger('dev', { "stream": winston.stream }));
    }
    // app.set('view engine', 'jade');
    //Enable jsonp
    app.enable("jsonp callback");

    //cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
      require(path.resolve(routePath))(app);
    });

    app.get('*',  function (req, res, next) {
        if (req.accepts('html')) {
            // Respond with html page.
            fs.readFile(config.root + '/public/views/' + '404.html', 'utf-8', function(err, page) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(page);
                res.end();
            });
        } else {
            if (req.accepts('json')) {
                // Respond with json.
                res.status(404).jsonp({ error: 'Not found' });
            } else {
                // Default to plain-text. send()
                res.status(404).type('txt').send('Not found');
            }
        }
    });

    app.use(function(err, req, res, next) {
        //Log it
        winston.error(err);

        if (req.accepts('html')) {
            // Respond with html page.
            fs.readFile(config.root + '/public/views/' + '404.html', 'utf-8', function(err, page) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(page);
                res.end();
            });
        } else {
            if (req.accepts('json')) {
                // Respond with json.
                res.status(404).jsonp({ error: 'Not found' });
            } else {
                // Default to plain-text. send()
                res.status(404).type('txt').send('Not found');
            }
        }
    });

};
