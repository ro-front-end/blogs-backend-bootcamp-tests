const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const Blog = require("../models/blogSchema");
const helper = require("./test-helpers");

const app = require("../app");
const User = require("../models/UserSchema");

const api = supertest(app);

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = {
    username: "testuser",
    password: "testpassword",
    name: "Test user",
  };

  const createdUser = await api.post("/api/users").send(user);

  const loginResponse = await api.post("/api/login").send(user);
  token = loginResponse.body.token;

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: createdUser.body.id })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blog actually creates a new blog with POST", async () => {
  const newBlog = {
    title: "Adding a new blog is hard for developers that actually codes",
    author: "Rodrigo Arellano",
    url: "fowfowfor89",
    likes: 23,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
});

test("verifies that the unique identifier property of the blog posts is named id", async () => {
  const response = await api
    .get("/api/blogs")
    .set("Authorization", `Bearer ${token}`);

  const blog = response.body[0];
  assert(blog.id !== undefined, "The id field is not defined.");
});

test("if likes property is missing, defaults to 0", async () => {
  const newBlog = {
    title: "New Blog",
    author: "Test Author",
    url: "http://example.com/new-blog",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0, "Likes default to 0");
});

test("fails with status code 400 if title, author or url are missing", async () => {
  const testCases = [
    {
      description: "Missing title",
      blogData: { author: "Test Author", url: "http://example.com/blog" },
    },
    {
      description: "Missing url",
      blogData: { title: "New Blog", author: "Test Author" },
    },
    {
      description: "Missing both title and url",
      blogData: { author: "Test Author" },
    },
    {
      description: "Missing author",
      blogData: { title: "New Blog", url: "http://example.com/blog" },
    },
  ];

  const results = await Promise.all(
    testCases.map(async (testCase) => {
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(testCase.blogData);
      return {
        description: testCase.description,
        status: response.status,
      };
    })
  );

  results.forEach((result) => {
    assert.strictEqual(
      result.status,
      400,
      `Expected 400 for case: ${result.description}`
    );
  });
});

test("blog can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  const updatedData = {
    title: "Updated title",
    author: "Updated author",
    url: "updated url",
    likes: 99,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedData)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.title, updatedData.title);
  assert.strictEqual(response.body.author, updatedData.author);
  assert.strictEqual(response.body.url, updatedData.url);
  assert.strictEqual(response.body.likes, updatedData.likes);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
});

test("blogs are successfully deleted", async () => {
  const blogAtStart = await helper.blogsInDb();
  const blogToDelete = blogAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
  const blogsAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test("blog can update likes with PATCH", async () => {
  const blogAtStart = await helper.blogsInDb();
  const blogToUpdate = blogAtStart[0];

  const response = await api
    .patch(`/api/blogs/${blogToUpdate.id}/likes`)
    .set("Authorization", `Bearer ${token}`)
    .send({ likes: 42 })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 42);
});

test("fails with status code 401 Unauthorized if token is missing when creating a blog", async () => {
  const newBlog = {
    title: "Unauthorized blog creation",
    author: "Test Author",
    url: "http://example.com/unauthorized-blog",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);
  assert.strictEqual(response.body.error, "token missing or invalid");
});

after(async () => {
  await mongoose.connection.close();
});
