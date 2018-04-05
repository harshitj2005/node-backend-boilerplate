'use strict';

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			id:{
				type:DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey:true
			},
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING
		},
		{
			instanceMethods: {
				toJSON: function () {
					var values = this.get();
					delete values.password;
					return values;
				}
			},
			associate: function(models) {
			},
			timestamps:false
		}
	);

	return User;
};
