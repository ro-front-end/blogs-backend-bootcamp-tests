const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list-helpers");

describe("Dummy test", () => {
  test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});
