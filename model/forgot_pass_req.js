
const Sequelize = require("sequelize")

const sequelize = require("../util/database")


const ForgotPassReq = sequelize.define('forgot_pass_req', {

    id: {
        type: Sequelize.STRING,
        allowNull: false,
        uniqe: true,
        primaryKey: true
    },

    userEmail: Sequelize.STRING,

    isactive: Sequelize.BOOLEAN
})

module.exports = ForgotPassReq