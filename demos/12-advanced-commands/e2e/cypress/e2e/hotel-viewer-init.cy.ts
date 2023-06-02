describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    // (cy as any).loadAndVisit();
    cy.loadAndVisit();
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
