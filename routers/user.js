const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin')
const UserController = require('../controller/UserController')
const User = require('../models/user');
const Account = require('../models/account');
const _ = require("lodash");
const { validateUser } = require('../models/user');

router.get('/me', auth, async(req, res) => {
  const c = new UserController();
  const id = req.user.id;
  const user = await c.getUsersById(id);

  const account = await Account.findOne({raw: true, where : {userId : user[0].id}})
  user[0].amount = account.amount;
  user[0].currency = account.currency;
  user[0].account_id = account.id;
  res.send(user);
})

router.get('/', [auth, admin], async(req, res) => {
  const c = new UserController();
  const users = await c.getUsers();
  res.json(users);
})

router.get('/:id', [auth, admin], async(req, res) => {
  const c = new UserController();
  const users = await c.getUsersById(req.params.id);
  res.json(users);
})

router.post('/', [auth, admin],async (req, res) => {
  const c = new UserController();
 
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let check_user_already_exist = await User.findOne({raw: true, where: {email : req.body.email}})
  if (check_user_already_exist) return res.status(400).send("User already exist");

  let user = _.pick(req.body, ["name", "email", "password"]);

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    let created_user = await c.createUser(user);
    res.json({status: "success", data: _.pick(created_user, ['id', 'email', 'name'])})
  }catch(err) {
    res.status(500).send("Something fail.");
  }
})

router.put('/:id', [auth, admin],async (req, res) => {
  const c = new UserController();

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let check_user_already_exist = await User.findOne({raw: true, where: {id : req.params.id}})
  if (!check_user_already_exist) return res.status(400).send("user does not exist with giving id.");

  let user = _.pick(req.body, ["name", "email", "password", "isAdmin"]);

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    let updated_user = await c.updateUser(req.params.id, user);
    res.json({status: "success udpated", data: _.pick(updated_user, ['id', 'email', 'name'])})
  }catch(err) {
    res.status(500).send("Something fail.");
  }
})

router.delete('/:id', [auth, admin],async (req, res) => {
  const c = new UserController();

  let check_user_already_exist = await User.findOne({raw: true, where: {id : req.params.id}})
  if (!check_user_already_exist) return res.status(400).send("user does not exist with giving id.");

  try {
    let delete_user = await c.deleteUser(req.params.id);
    res.json({status: "success deleted", data: delete_user})
  }catch(err) {
    res.status(500).send("Something fail.");
  }
})

module.exports = router;
