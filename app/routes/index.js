'use strict';

var index = require('app/controllers/index');
var authenticate = require('app/middleware/authenticate');

module.exports = function(app) {
// Home route
    app.get('/', index.home);
};

