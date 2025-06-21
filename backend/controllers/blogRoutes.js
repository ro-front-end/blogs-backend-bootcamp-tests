const blogRouter = require("express").Router();
const mongoose = require("mongoose");
const Blog = require("../models/blogSchema");
const User = require("../models/UserSchema");
const logger = require("../utils/logger");
const { userExtractor } = require("../utils/middleware");
const supabase = require("../supabase");

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

blogRouter.post("/", userExtractor, async (request, response) => {
  const { title, author, url, likes, content, imageUrl } = request.body;
  if (!title || !author || !content) {
    return response
      .status(400)
      .send({ error: "title, author and content are required." });
  }

  const user = request.user;

  try {
    const blog = new Blog({
      title,
      author,
      content,
      url,
      imageUrl,
      likes: likes || 0,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog without multer:", error);
    response.status(500).json({ error: error.message });
  }
});

blogRouter.put("/:id", userExtractor, async (request, response) => {
  const { title, author, url, likes, content, imageUrl } = request.body;

  const updatedBlog = {
    title,
    author,
    content,
    url,
    likes,
  };

  if (imageUrl) {
    updatedBlog.imageUrl = imageUrl;
  }

  try {
    const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (blog) {
      response.json(blog);
    } else {
      response.status(404).send({ error: "Blog not found." });
    }
  } catch (error) {
    logger.error("Error updating blog:", error);
    response.status(500).send("Error updating blog.");
  }
});

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
