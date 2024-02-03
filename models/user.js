const {DataTypes} = require('sequelize');
const sequelize = require('../database/db');
const Joi = require('joi');
const jwt = require("jsonwebtoken");

const User = sequelize.define('Users', {
   name: {
     type: DataTypes.STRING,
     allowNull: false
   },
   email: {
     type: DataTypes.STRING,
     unique: 'compositeIndex',
     allowNull: false
   },
   password: {
     type: DataTypes.STRING,
     allowNull: false
   },
   isAdmin : {
     type: DataTypes.BOOLEAN,
     defaultValue: false
   }
})

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(3).max(255).required(),
    isAdmin : Joi.number()
  });

  return schema.validate(user);
}

function generateUserAuthToken(user) {
  const token = jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    'myominkyaw'
  );
  return token;id
};

module.exports = User;
module.exports.validateUser = validateUser; 
module.exports.generateAuthToken = generateUserAuthToken
