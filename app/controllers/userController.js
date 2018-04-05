'use strict';

/**
 * Module dependencies.
 */
var jwt = require('jsonwebtoken');
var config = require('config/config');
var db = require('config/sequelize');
var logger = require('config/winston');
var userModel = require('app/models/user');

var apiFunctions = {
    authenticate: (req, res) => {
        res.status(200).jsonp({ info: 'This is authenticate' });
    },
    getToken: (req, res) => {
        if(req.body.username && req.body.password){
            var username = req.body.username;
            var password = req.body.password;
        }

        if(!username || !password){
            return res.status(401).jsonp({message:'Username and password are required'});
        }

        db.User.findOne({
            where:{username:username}
        })
        .then(userData => {
            console.log(userData);
            res.jsonp(userData);
        }, err => {
            logger.error('error occured in user find',err);
            res.status(500).jsonp({message:'Something went wrong'});
        });
        return;
        // var payload = {id: 1};
        // var token = jwt.sign(payload, config.secretKey);
    },
    register: (req, res) => {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
        User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        }, (err, user) => {
            if (err) 
                return res.status(500).send("There was a problem registering the user.")
            // create a token
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        });
    }
}
module.exports = apiFunctions