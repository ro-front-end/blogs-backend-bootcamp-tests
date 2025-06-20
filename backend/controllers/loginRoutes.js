const loginRouter = require("express").Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

loginRouter.post("/", async (request, response, next) => {
  try {
    const { username, password } = request.body;

    const user = await User.findOne({ username }).populate("blogs");
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!user || !passwordCorrect) {
      return response
        .status(401)
        .json({ error: "invalid username or password" });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    response.status(200).send({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        blogs: user.blogs,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
