describe("task smoke test", () => {
  it("hotels data from server", () => {
    cy.task("getData", "http://localhost:3000/api/hotels").then((data) => {
      console.log(data as any[]);
      const hotels = (data as any[]).map((d) => ({
        ...d,
        name: "foo",
      }));

      cy.intercept("GET", "/api/hotels", hotels).as("hotels");
      cy.visit("/hotel-collection");
      cy.wait("@hotels");
      cy.get('[data-testid="hotels"] > li').should("have.length", 10);
    });
  });
});
