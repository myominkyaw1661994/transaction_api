const express = require("express");
const user = require("../routers/user");
const auth = require("../routers/auth");
const account = require("../routers/account");
const transaction = require("../routers/transaction");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use("/api/account", account);
  app.use("/api/transaction", transaction);
  // handle all error
  app.use(error);
};
