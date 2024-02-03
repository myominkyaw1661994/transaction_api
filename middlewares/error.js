const logger = require("../log/logging");

const today = Date(Date.now);

module.exports = function (err, req, res, next) {
  console.log(err);
  logger.log("error", err.message + " " + today.toString());
  res.status(500).send("Something fail");
};
