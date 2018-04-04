'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var config = require('config/config');
var winston = require('config/winston');
var db = {};

var sequelize =  new Sequelize(config.db.name, config.db.username, config.db.password, {
        host: config.db.host,
        port: config.db.port,
        dialect: 'mysql',
        storage: config.db.storage,
        logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
    });

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(config.modelsDir)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    // import model files and save model names
    .forEach(function (file) {
        var model = sequelize.import(path.join(config.modelsDir, file));
        db[model.name] = model;
    });

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db)
    }
});

// assign the sequelize variables to the db object and returning the db. 
module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);