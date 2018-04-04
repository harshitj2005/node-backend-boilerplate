'use strict';

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			hashedPassword: DataTypes.STRING,
			salt: DataTypes.STRING,
		},
		{
			instanceMethods: {
				toJSON: function () {
					var values = this.get();
					delete values.hashedPassword;
					delete values.salt;
					return values;
				},
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) {
                        return '';
                    }
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
				}
			},
			associate: function(models) {
			}
		}
	);

	return User;
};
