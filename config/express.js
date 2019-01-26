"use strict";

/**
 * Module dependencies.
 */
var fs = require("fs"),
    express = require("express"),
    compression = require("compression"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    _ = require("lodash"),
    glob = require("glob"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    path = require("path");
    
var config = require("config/config");
var winston = require("config/winston");
var strategy = require("app/middleware/strategy");

module.exports = function(app) {

    app.set("showStackError", true);    
    
    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader("Content-Type"));
        },
        level: 9
    }));

    //Setting the fav icon and static folder
    app.use(favicon(config.root + "/public/img/icons/favicon.ico"));
    app.use(express.static(config.root + "/public"));

    //Don't use logger for test env
    if (config.NODE_ENV !== "test") {
        app.use(logger("dev", { "stream": winston.stream }));
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

    passport.use(strategy)
    app.use(passport.initialize());
    // Globbing routing files
    getGlobbedFiles("./app/routes/**/*.js").forEach(function(routePath) {
      require(path.resolve(routePath))(app);
    });

    app.get("*",  function (req, res) { 
        if (req.accepts("html")) {
            // Respond with html page.
            fs.readFile(config.root + "/public/views/" + "404.html", "utf-8", function(err, page) {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.write(page);
                res.end();
            });
        } else {
            if (req.accepts("json")) {
                // Respond with json.
                res.status(404).jsonp({ error: "Not found" });
            } else {
                // Default to plain-text. send()
                res.status(404).type("txt").send("Not found");
            }
        }
    });

    app.use(function(err, req, res) {
        //Log it
        winston.error(err);

        if (req.accepts("html")) {
            // Respond with html page.
            fs.readFile(config.root + "/public/views/" + "500.html", "utf-8", function(err, page) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.write(page);
                res.end();
            });
        } else {
            if (req.accepts("json")) {
                // Respond with json.
                res.status(500).jsonp({ error: "Not found" });
            } else {
                // Default to plain-text. send()
                res.status(500).type("txt").send("Not found");
            }
        }
    });

};

function getGlobbedFiles (globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp("^(?:[a-z]+:)?\/\/", "i");   // eslint-disable-line

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			var files = glob(globPatterns, { sync: true });

			if (removeRoot) {
				files = files.map(function(file) {
					return file.replace(removeRoot, "");
				});
			}

			output = _.union(output, files);
		}
	}

	return output;
}