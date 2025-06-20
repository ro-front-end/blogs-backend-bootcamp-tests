const { test, describe } = require("node:test");
const assert = require("node:assert");

const { favoriteBlog } = require("../utils/list-helpers");

describe("Favorite blog", async () => {
  const blogs = [];

  test("Is the blog with most likes.");

  const result = await favoriteBlog(blogs);
  assert.strictEqual(result.likes, 15);
});
