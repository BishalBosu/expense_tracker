const Sequelize = require("sequelize")

const sequelize = require("../util/database")

const Expense = sequelize.define("expense", {

	id: {
		type: Sequelize.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},

	amount: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},

	desc: {
		type: Sequelize.STRING,
		allowNull: false,
	},
    type: {
		type: Sequelize.STRING,
		allowNull: false,
	}


});

module.exports = Expense