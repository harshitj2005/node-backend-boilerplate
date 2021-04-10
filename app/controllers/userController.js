"use strict";

/**
 * Module dependencies.
 */
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var config = require("config/config");
var db = require("config/sequelize");
var logger = require("config/winston");

var apiFunctions = {
    authenticate: (req, res) => {
        res.status(200).jsonp({ info: "This is authenticate" });
    },
    getToken: (req, res) => {
        if(req.body.email && req.body.password){
            var email = req.body.email;
            var password = req.body.password;
        }

        if(!email || !password){
            return res.status(401).jsonp({message:"Email and password are required"});
        }

        db.User.findOne({
            where:{email:email}
        })
        .then(userData => {
            var passwordIsValid = bcrypt.compareSync(password, userData.password);
            if (!passwordIsValid) 
                return res.status(401).jsonp({ auth: false, token: null });

            var token = jwt.sign({ id: userData.id }, config.secretKey, {
                expiresIn: 2
            });
            res.status(200).jsonp({ auth: true, token: token });
        }, err => {
            logger.error("error occured in user find",err);
            res.status(500).jsonp({message:"Something went wrong"});
        });
    },
    register: (req, res) => {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
        db.User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        })
        .then((user) => {
            var token = jwt.sign({ id: user.id }, config.secretKey, {
                expiresIn: 86400
            });
            return res.status(200).jsonp({ auth: true, token: token });
        }, (err) => {
            logger.error("error occured in user create",err);
            return res.status(500).jsonp({message:"There was a problem registering the user."});
        });
    }
}
module.exports = apiFunctions