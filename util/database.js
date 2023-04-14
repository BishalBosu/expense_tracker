const Sequelize = require('sequelize');

const sequelize = new Sequelize("expense", "root", "8485", {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;