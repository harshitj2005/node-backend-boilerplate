'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var config = require('config/config');

var apiFunctions = {
    home: function(req,res){
        if (req.accepts('html')) {
            // Respond with html page.
            fs.readFile(config.root + '/public/views/' + 'index.html', 'utf-8', function(err, page) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(page);
                res.end();
            });
        } else {
            if (req.accepts('json')) {
                // Respond with json.
                res.status(200).jsonp({ info: 'This is home' });
            } else {
                // Default to plain-text. send()
                res.status(200).type('txt').send('This is home');
            }
        }
        return;
    }
}
module.exports = apiFunctions