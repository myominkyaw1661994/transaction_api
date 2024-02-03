require("express-async-errors");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log(ex.message);
  });

  process.on("unhandledRejection", (ex) => {
    console.log("unhandle exception");
    process.exit(1);
  });
};
