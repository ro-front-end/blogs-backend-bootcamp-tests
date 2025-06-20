const Blog = require("../models/blogSchema");
const axios = require("axios");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/blogs");

    const blogs = response.data;

    const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
    console.info(`total likes are: ${total}`);

    return total;
  } catch (error) {
    console.error("Error getting blogs likes", error);
    throw new Error("Error getting likes.");
  }
};

const favoriteBlog = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/blogs");

    const blogs = response.data;

    const favorite = blogs.reduce(
      (max, blog) => {
        return blog.likes > max.likes ? blog : max;
      },
      { likes: 0 }
    );

    console.info(
      `blog with more likes is: ${JSON.stringify(favorite, null, 2)}`
    );

    return favorite;
  } catch (error) {
    console.error("Error getting favorite blog.", error);
    throw new Error("Error getting favorite blog.");
  }
};

module.exports = { dummy, totalLikes, favoriteBlog };
