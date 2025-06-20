const usersRouter = require("express").Router();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  response.json(users);
});

usersRouter.get("/:id", async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
      content: 1,
      likes: 1,
    });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    response.json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    if (!username || !password || username.length < 3 || password.length < 3) {
      return response.status(400).json({
        error:
          "Username and password are required to have at least 3 characters long.",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
