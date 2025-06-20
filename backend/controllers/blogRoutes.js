const blogRouter = require("express").Router();
const mongoose = require("mongoose");
const Blog = require("../models/blogSchema");
const User = require("../models/UserSchema");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");
const multer = require("multer");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (request, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const uploads = multer({ storage: storage });

blogRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    logger.error("Error retrieving blogs:", error);
    response.status(500).send("Error retrieving blogs.");
  }
});

blogRouter.get("/:id", async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    console.log("Blog fetched by id:", blog);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).send({ error: "Blog not found." });
    }
  } catch (error) {
    logger.error("Error retrieving blog:", error);
    response.status(500).send("Error retrieving blogs");
  }
});

blogRouter.post(
  "/",
  userExtractor,
  uploads.single("file"),
  async (request, response) => {
    console.log("request body:", request.body);
    const { title, author, url, likes, content } = request.body;

    if (!title || !author || !content) {
      return response
        .status(400)
        .send({ error: "title, author and content are required." });
    }

    const user = request.user;

    const imageUrl = request.file
      ? `${request.protocol}://${request.get("host")}/uploads/${
          request.file.filename
        }`
      : undefined;

    const blog = new Blog({
      title,
      author,
      content,
      url,
      imageUrl,
      likes: likes || 0,
      user: user._id,
    });

    try {
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (error) {
      logger.error("Error creating blog:", error);
      response.status(500).send("Error creating blog.");
    }
  }
);

blogRouter.post("/upload", uploads.single("image"), (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({ error: "No file uploaded" });
    }

    const fullUrl = `${request.protocol}://${request.get("host")}/uploads/${
      request.file.filename
    }`;

    response.status(200).json({
      message: "File uploaded succesfully",
      imageUrl: fullUrl,
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: "error uploading file" });
  }
});

blogRouter.put(
  "/:id",
  userExtractor,
  uploads.single("file"),
  async (request, response) => {
    const { title, author, url, likes, content } = request.body;

    const updatedBlog = {
      title,
      author,
      content,
      url,
      likes,
    };

    if (request.file) {
      updatedBlog.imageUrl = `${request.protocol}://${request.get(
        "host"
      )}/uploads/${request.file.filename}`;
    }

    try {
      const blog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedBlog,
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      if (blog) {
        response.json(blog);
      } else {
        response.status(404).send({ error: "Blog not found." });
      }
    } catch (error) {
      logger.error("Error updating blog:", error);
      response.status(500).send("Error updating blog.");
    }
  }
);

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).send({ error: "Blog not found" });
    }

    if (blog.user.toString() !== request.user._id.toString()) {
      return response
        .status(403)
        .json({ error: "You do not have permission to delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    if (blog) {
      response.status(204).send();
    } else {
      response.status(404).send({ error: "Blog not found" });
    }
  } catch (error) {
    logger.error("Error deleting blog:", error);
    response.status(500).send("Error deleting blog.");
  }
});

blogRouter.patch("/:id/likes", userExtractor, async (request, response) => {
  const userId = request.user._id;

  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    if (blog.likedBy.includes(userId)) {
      return response
        .status(400)
        .json({ error: "You already liked this article" });
    }

    blog.likes = (blog.likes || 0) + 1;
    blog.likedBy.push(userId);

    const updatedBlog = await blog.save();
    response.json(updatedBlog);
  } catch (error) {
    response.status(500).json({ error: "Error updating likes" });
  }
});

module.exports = blogRouter;
