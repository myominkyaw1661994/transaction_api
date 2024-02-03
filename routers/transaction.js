const express = require('express');
const router = express.Router();
const _ = require("lodash");
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const User = require('../models/user');
const TransactionController = require('../controller/TransactionController')
const Account = require('../models/account');
const { validateTransaction } = require('../models/transaction');

router.post('/', auth, async (req, res) => {
  const transactionController = new TransactionController();  

  const { error } =  validateTransaction(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let from_user = await User.findOne({raw: true, where: {id : req.body.from_user_id}})
  if (!from_user) return res.status(400).send("Invalid user id");

  let to_user = await User.findOne({raw: true, where: {id : req.body.to_user_id}})
  if (!to_user) return res.status(400).send("Invalid user id");

  let from_account = await Account.findOne({raw: true, where: {userId: from_user.id}});
  let to_account = await Account.findOne({raw: true, where: {userId: to_user.id}});

  if(!from_account || !to_account) return res.status(400).send("Invalid account");
  if( req.body.amount > from_account.amount) return res.status(400).send("Insufficient Balance");

  const tansaction_obj = _.pick(req.body, ['from_user_id', 'to_user_id', 'amount'])

  let result = await transactionController.createTransaction(tansaction_obj);

  res.send(result);
})

router.get('/transactionhistory/:userid', auth, async (req, res) => {
  const transactionController = new TransactionController();
  console.log(parseInt(req.params.userid))

  if(!/^[0-9]+$/.test(req.params.userid)) {
    return res.status(400).send("Invalid user id");
  }

  if(req.body.pageNumber || req.body.itemsPerPage) {
    if(!/^[0-9]+$/.test(req.body.pageNumber) || !/^[0-9]+$/.test(req.body.itemsPerPage)) {
      return res.status(400).send("Invalid request body");
    }
  }
  
  const history = await transactionController.getTransactionHistoryByUser(req.params.userid, req.body.pageNumber, req.body.itemsPerPage);
  res.json(history);
})
  
router.get('/transactionInhistory/:userid', auth, async (req, res) => {
  const transactionController = new TransactionController();  
  
  if(!/^[0-9]+$/.test(req.params.userid)) {
    return res.status(400).send("Invalid user id");
  }

  if(req.body.pageNumber || req.body.itemsPerPage) {
    if(!/^[0-9]+$/.test(req.body.pageNumber) || !/^[0-9]+$/.test(req.body.itemsPerPage)) {
      return res.status(400).send("Invalid request body");
    }
  } 
  const history = await transactionController.getTransactionInHistoryByUser(req.params.userid, req.body.pageNumber, req.body.itemsPerPage);
  res.json(history);
})

router.get('/transactionOuthistory/:userid', auth, async (req, res) => {
  const transactionController = new TransactionController();   

  if(!/^[0-9]+$/.test(req.params.userid)) {
    return res.status(400).send("Invalid user id");
  }

  if(req.body.pageNumber || req.body.itemsPerPage) {
    if(!/^[0-9]+$/.test(req.body.pageNumber) || !/^[0-9]+$/.test(req.body.itemsPerPage)) {
      return res.status(400).send("Invalid request body");
    }
  }
  const history = await transactionController.getTransactionOutHistoryByUser(req.params.userid, req.body.pageNumber, req.body.itemsPerPage);
  res.json(history);
})


router.get('/detail/:id', [auth], async (req, res) => {
  const transactionController = new TransactionController();

  if(!/^[0-9]+$/.test(req.params.id)) {
    return res.status(400).send("Invalid transaction id");
  }

  const history = await transactionController.getTransactionDetail(req.params.id);
  res.json(history);
})
  


module.exports = router;
