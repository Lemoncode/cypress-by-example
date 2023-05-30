/// <reference types="Cypress" />

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  
  it("focuses the input name on load", () => {
    cy.get("[type='text']").should("have.focus");
  });

  it("name accepts input", () => {
    const typedText = "admin";
    cy.get("#name").type(typedText).should("have.value", typedText);
  });
});
