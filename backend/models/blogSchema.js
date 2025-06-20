const mongoose = require("mongoose");
require("./UserSchema");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      minLength: 5,
    },
    author: {
      type: String,
      minLength: 3,
    },
    content: {
      type: String,
    },
    url: String,
    likes: Number,
    imageUrl: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
