// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const { jwtDecode } = require("jwt-decode");

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/login`, {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("token", body.token);
    localStorage.setItem("user", JSON.stringify(body.user));
    const decodedToken = jwtDecode(body.token);
    const expirationTime = decodedToken.exp * 1000;
    localStorage.setItem("tokenExpiration", expirationTime.toString());
    cy.wrap(body.token).as("token");
    cy.visit("");
  });
});

Cypress.Commands.add(
  "createNewBlog",
  function ({ title, author, content, imageUrl }) {
    cy.get("@token").then((token) => {
      cy.request({
        url: `${Cypress.env("BACKEND")}/blogs`,
        method: "POST",
        body: { title, author, content, imageUrl },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        cy.visit("/blogs");
      });
    });
  }
);

Cypress.Commands.add("loginFail", function ({ username, password }) {
  cy.request({
    url: `${Cypress.env("BACKEND")}/login`,
    method: "POST",
    body: { username, password },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(401); // o el código que use tu backend
    expect(response.body.error || response.body.message).to.exist;
    expect(response.body.token).to.be.undefined;
  });
});
