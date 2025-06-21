const blogRouter = require("express").Router();
const mongoose = require("mongoose");
const Blog = require("../models/blogSchema");
const User = require("../models/UserSchema");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");
const multer = require("multer");
const supabase = require("../supabase");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }
//   return null;
// };

const multerMemory = multer();

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
  multerMemory.single("file"), // usar multer en memoria para obtener buffer
  async (request, response) => {
    const { title, author, url, likes, content } = request.body;

    if (!title || !author || !content) {
      return response
        .status(400)
        .send({ error: "title, author and content are required." });
    }

    const user = request.user;
    let imageUrl;

    try {
      if (request.file) {
        // subir imagen a supabase
        const fileName = `images/${Date.now()}_${request.file.originalname}`;
        const { data, error } = await supabase.storage
          .from("estetechy-blogs-bucket")
          .upload(fileName, request.file.buffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: request.file.mimetype,
          });

        if (error) {
          return response.status(500).json({ error: "Error uploading image" });
        }

        // obtener url pública
        const { publicUrl, error: urlError } = supabase.storage
          .from("estetechy-blogs-bucket")
          .getPublicUrl(fileName);

        if (urlError) {
          return response
            .status(500)
            .json({ error: "Error getting public URL" });
        }

        imageUrl = publicUrl;
      }

      // crear blog con imageUrl de supabase
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
      logger.error("Error creating blog:", error);
      response.status(500).send("Error creating blog.");
    }
  }
);

blogRouter.post("/upload", multerMemory.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const { data, error } = await supabase.storage
      .from("estetechy-blogs-bucket") // nombre del bucket
      .upload(
        `images/${Date.now()}_${req.file.originalname}`,
        req.file.buffer,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        }
      );

    if (error) throw error;

    // Obtener la URL pública (si el bucket es público)
    const publicUrl = supabase.storage
      .from("estetechy-blogs-bucket")
      .getPublicUrl(data.path);

    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: publicUrl.data.publicUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

blogRouter.put(
  "/:id",
  userExtractor,
  multerMemory.single("file"),
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
      try {
        const { data, error } = await supabase.storage
          .from("estetechy-blogs-bucket")
          .upload(
            `images/${Date.now()}_${request.file.originalname}`,
            request.file.buffer,
            {
              cacheControl: "3600",
              upsert: false,
              contentType: request.file.mimetype,
            }
          );

        if (error) throw error;

        const { publicUrl, error: urlError } = supabase.storage
          .from("estetechy-blogs-bucket")
          .getPublicUrl(data.path);

        if (urlError) throw urlError;

        updatedBlog.imageUrl = publicUrl;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return response.status(500).json({ error: "Error uploading image" });
      }
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
