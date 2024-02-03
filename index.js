const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routers")(app);
require("./startup/db")();

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
});

module.exports = server;
