const pingRouter = require("express").Router();

pingRouter.get("/", (request, response) => {
  response.status(200).send("pong");
});

module.exports = pingRouter;
