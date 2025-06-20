const { defineConfig } = require("cypress");
const codeCoverageTask = require("@cypress/code-coverage/task");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    baseUrl: "http://localhost:3000",
    env: {
      BACKEND: "http://localhost:3001/api",
    },
  },
});
