"use strict";

/**
 * Module dependencies.
 */

var passport = require("passport");

var authenticate = {
    jwtAuth : (req, res, next) => {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).jsonp({
                    message: info ? info.message : "Invalid token"
                });
            }
            next();
        })(req, res);
    }
};

module.exports = authenticate;