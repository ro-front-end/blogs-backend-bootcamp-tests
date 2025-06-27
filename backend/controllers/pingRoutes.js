const pingRouter = require("express").Router();

pingRouter.head("/", (request, response) => {
  response.status(200).end();
});

module.exports = pingRouter;
