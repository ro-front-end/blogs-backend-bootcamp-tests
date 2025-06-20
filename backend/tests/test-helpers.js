const Blog = require("../models/blogSchema");

const initialBlogs = [
  { title: "Blog 1", author: "Author 1", url: "http://example.com/1" },
  { title: "Blog 2", author: "Author 2", url: "http://example.com/2" },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
