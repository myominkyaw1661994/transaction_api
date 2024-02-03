const express = require('express');
const router = express.Router();
const _ = require("lodash");
const { validateAccount } = require('../models/account');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin')
const AccountController = require('../controller/AccountController')
const User = require('../models/user');
const Account = require('../models/account');

router.post('/', [auth, admin],async (req, res) => {
  const accountController = new AccountController();  

  const { error } =  validateAccount(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({raw: true, where: {id : req.body.userId}})
  if (!user) return res.status(400).send("User with the given id does not exist.");

  let amount = parseInt(req.body.amount);
  if(amount < 0 ){
    return res.status(400).send("Invaid amount");
  }

  const account = _.pick(req.body, ['userId', 'amount', 'currency'])
  const response = await accountController.createAccount(account);
 
  res.send({status: "success created", data: response});
})

router.put('/:id', [auth, admin], async (req, res) => {
    const accountController = new AccountController();  
  
    const { error } =  validateAccount(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({raw: true, where: {id : req.body.userId}})
    if (!user) return res.status(400).send("User with the given id does not exist.");
  
    let amount = parseInt(req.body.amount);
    if(amount < 0 ){
      return res.status(400).send("Invaid amount");
    }
  
    const account = _.pick(req.body, ['userId', 'amount', 'currency'])
    const response = await accountController.updateAccount(req.params.id, account);
   
    res.send({status: "success updated", data: account});
})
  

router.delete('/:id',[auth, admin], async (req, res) => {
    const accountController = new AccountController();  
  
    let account = await Account.findOne({raw: true, where: {id : req.params.id}})
    if (!account) return res.status(400).send("Account with the given id does not exist.");
  
    const response = await accountController.deleteAccount(req.params.id);
   
    res.send({status: "success deleted", data: account});
})



module.exports = router;
