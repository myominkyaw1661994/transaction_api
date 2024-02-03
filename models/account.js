const {DataTypes} = require('sequelize');
const sequelize = require('../database/db');
const Joi = require('joi');

const Account = sequelize.define('Accounts', {
   userId: {
     type: DataTypes.STRING,
     allowNull: false
   },
   amount: {
     type: DataTypes.INTEGER,
     allowNull: false,
     defaultValue: 10000
   },
   currency: {
    type: DataTypes.STRING,
    defaultValue: 'SDG'
   }
})

function validateAccount(user) {
    const schema = Joi.object({
      userId: Joi.required(),
      amount: Joi.number().required(),
      currency: Joi.string().required(),
    });
  
    return schema.validate(user);
}

module.exports = Account;
module.exports.validateAccount = validateAccount;
