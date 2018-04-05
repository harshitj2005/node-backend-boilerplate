'use strict';

var userController = require('app/controllers/userController');
var authenticate = require('app/middleware/authenticate');

module.exports = function(app) {
    app.get('/authenticate', authenticate.jwtAuth, userController.authenticate);
    app.post('/getToken', userController.getToken);
};

