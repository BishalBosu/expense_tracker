
const Sequelize = require("sequelize")

const sequelize = require("../util/database")

const DownloadUrl = sequelize.define('downloadurl', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
        uniqe: true,
        primaryKey: true
    },
    fileurl: Sequelize.STRING
})

module.exports = DownloadUrl;