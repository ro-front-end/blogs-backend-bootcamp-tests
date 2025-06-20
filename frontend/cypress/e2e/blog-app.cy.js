describe("BLog app", function () {
  this.beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "testuser",
      username: "testuser",
      password: "123456",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });
  it("front-end page can be opened", function () {
    cy.visit("");
  });

  it("mock user can login and redirected to /blogs", function () {
    cy.contains("Login to Post Blogs!");
    cy.get("#username").type("testuser");
    cy.get("#password").type("123456");
    cy.get("#login-button").click();
    cy.url({ timeout: 10000 }).should("include", "/blogs");
  });

  it("can't enter to app with wrong credentials", function () {
    cy.loginFail({ username: "testuser", password: "654321" });
  });

  describe("when loggen in", function () {
    beforeEach(function () {
      cy.login({ username: "testuser", password: "123456" });
      cy.createNewBlog({
        title: "first blog",
        author: "testuser",
        content: "first content for blog",
        imageUrl: "/ads-future.png",
      });
      cy.createNewBlog({
        title: "second blog",
        author: "testuser",
        content: "second content for blog",
        imageUrl: "/comp-cuant.png",
      });
      cy.createNewBlog({
        title: "third blog",
        author: "testuser",
        content: "third content for blog",
        imageUrl: "/lenses-article.png",
      });
    });
    it("Can see blogs", function () {
      cy.contains("first blog");
      cy.contains("second blog");
      cy.contains("third blog");
    });

    it("click on a blog to see details and like a blog", function () {
      // Primero haces click en "See more..." para ir al detalle del blog
      cy.contains("See more...").click();

      // Verificas que la url sea la del detalle, con id dinámico hexadecimal (puede ajustar regex)
      cy.url({ timeout: 10000 }).should("match", /\/blogs\/[0-9a-f]+$/);

      // Obtienes el número de likes antes de dar like
      cy.get("#likes-count")
        .invoke("text")
        .then((textBefore) => {
          const likesBefore = parseInt(textBefore.trim());

          // Das click en el icono de like
          cy.get("#thumbup").click();

          // Esperas que el número de likes sea mayor después del click
          cy.get("#likes-count")
            .invoke("text")
            .should((textAfter) => {
              const likesAfter = parseInt(textAfter.trim());
              expect(likesAfter).to.be.greaterThan(likesBefore);
            });
        });
    });

    it("mock user can get into the settings page and delete and edit blogs", function () {
      cy.get("#settings-link").click();
      cy.url().should("include", "/settings");

      cy.contains("second blog").parent().get("#edit-button").click();
      cy.get("#title-input").clear().type("first blog - edited");

      cy.contains("Edit Post").click();

      cy.contains("first blog - edited").parent().get("#delete-button").click();
    });
  });
});
