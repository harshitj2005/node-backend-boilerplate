"use strict";

/**
 * Module dependencies.
 */

var passportJWT = require("passport-jwt");
var config = require("config/config");
var logger = require("config/winston");
var _ = require("lodash");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var users = [
    {
      id: 1,
      name: "jonathanmh",
      password: "%2yx4"
    },
    {
      id: 2,
      name: "test",
      password: "test"
    }
  ];
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.secretKey;

var strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  logger.info("payload received in strategy", jwt_payload);
  // usually this would be a database call:
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

module.exports = strategy;