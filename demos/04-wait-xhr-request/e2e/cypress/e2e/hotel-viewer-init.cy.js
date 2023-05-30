/// <reference types="Cypress" />

describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
    cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" }).as("load");
    cy.wait('@load');
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
