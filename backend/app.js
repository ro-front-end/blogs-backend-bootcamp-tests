const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogRoutes");
const usersRouter = require("./controllers/usersRouters");
const loginRouter = require("./controllers/loginRoutes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const cors = require("cors");

const app = express();

// DB connection
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.info("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("couldn't connect to MongoDB", error.message);
  });

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://techy-blogs-fullstack.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static("uploads"));
app.use(middleware.requestLogger);

// Routes

// Token middleware
app.use(middleware.tokenExtractor);

// Routes
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);

// Public routes
app.use("/api/blogs", blogsRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testingRoutes");
  app.use("/api/testing", testingRouter);
}

// Error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// Port
app.listen(config.PORT, () => {
  logger.info(`Server running on port: ${config.PORT}`);
});

module.exports = app;
