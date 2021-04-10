'use strict';

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			id:{
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV1,
				primaryKey:true
			},
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			created_at: {
			  type: DataTypes.DATE,
			  allowNull: true,
			},
			modified_at: {
			  type: DataTypes.DATE,
			  allowNull: true
			},
		},
		{
			instanceMethods: {
				toJSON: function () {
					var values = this.get();
					delete values.password;
					return values;
				}
			},
			hooks: {
				beforeCreate: function (User, options) {
					return new Promise ((resolve) => {
						User.created_at = sequelize.fn("NOW");
						User.modified_at = sequelize.fn("NOW");
						return resolve(User, options);
					});
				},
				beforeUpdate: function (User, options) {
					return new Promise ((resolve) => {
						User.modified_at = sequelize.fn("NOW");
						return resolve(User, options);
					});
				},
			},
			associate: function(models) {
			},
			timestamps: false,
			tableName: "users",
			freezeTableName: true,
		}
	);

	return User;
};
