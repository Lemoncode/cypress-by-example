/// <reference types="Cypress" />

describe("Login", () => {
  it("visit the login page", () => {
    cy.visit("/");
  });

  it("focuses the input name on load", () => {
    cy.visit("/");
    cy.get("[type='text']").should("have.focus");
  });
});
