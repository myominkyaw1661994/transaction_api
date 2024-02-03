const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transaction', 'root', '2L9bGh&$nY', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize
