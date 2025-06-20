const { test, describe } = require("node:test");
const assert = require("node:assert");

const { totalLikes } = require("../utils/list-helpers");

describe("totalLikes", async () => {
  const blogs = [];

  test("Is the total sum of all blogs likes.");

  const result = await totalLikes(blogs);
  assert.strictEqual(result, 38);
});
