/// <reference types="Cypress" />

describe("Filter panel", () => {
  it("filters hotels by rating", () => {
    cy.loadAndVisit("hotels-extended.json");

    const filters = [
      { value: "all", expectedLength: 4 },
      { value: "bad", expectedLength: 2 },
      { value: "good", expectedLength: 1 },
      { value: "excellent", expectedLength: 1 },
    ];

    cy.wrap(filters).each((filter) => {
      const { value, expectedLength } = filter;
      cy.contains(value).click();
      cy.get('[data-testid="hotels"] > li').should(
        "have.length",
        expectedLength
      );
    });
  });
});
