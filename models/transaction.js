const {DataTypes} = require('sequelize');
const sequelize = require('../database/db');
const Joi = require('joi');

const Transaction = sequelize.define('Transactions', {
   from_user_id: {
     type: DataTypes.STRING,
     allowNull: false
   },
   to_user_id: {
     type: DataTypes.STRING,
     allowNull: false
   },
   amount: {
    type: DataTypes.INTEGER,
    allowNull: false
   }

})

function validateTransaction(user) {
  const schema = Joi.object({
    from_user_id: Joi.string().required(),
    to_user_id: Joi.string().required(),
    amount: Joi.number().required()
  });

  return schema.validate(user);
}

module.exports = Transaction;
module.exports.validateTransaction = validateTransaction