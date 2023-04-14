const Sequelize = require("sequelize")

const sequelize = require("../util/database")

const User = sequelize.define("user", {
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},

	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = User
