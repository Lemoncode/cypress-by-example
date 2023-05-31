describe("Hotels smoke tests", () => {
  describe("Hotel form", () => {
    const newHotel = {
      id: "Test id",
      picture: "Test picyture",
      name: "Test hotel",
      description: "This is a foo description",
      city: "Seattle",
      address: "Foo address",
      rating: 4,
    };

    beforeEach(() => {
      cy.request("DELETE", "http://localhost:3000/api/hotels/all");
    });

    context("user fullfils form valid fields", () => {
      describe("user clicks on save", () => {
        it("adds a new hotel", () => {
          // Arrange
          cy.intercept("POST", "/api/hotels").as("create");
          cy.intercept("GET", "/api/cities").as("load");

          cy.visit("/hotel-edit/0");
          cy.wait("@load");

          // Act
          cy.get("#name").type(newHotel.name);
          cy.get("#address").type(newHotel.address);
          cy.get("#description").type(newHotel.description);

          cy.get("#city").click();
          cy.get('[data-value="Seattle"]').click();
          cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();

          // Assert
          cy.get('[data-testid="hotels"] > li').should("have.length", 1);
        });
      });
    });
  });

  describe("Hotel viewer", () => {
    beforeEach(() => {
      cy.fixture("hotels-server").then((hotels) => {
        cy.request("POST", "http://localhost:3000/api/hotels/bulkload", {
          hotels,
        });
        cy.intercept("GET", "/api/hotels").as("load");
        cy.visit("/hotel-collection");
        cy.wait("@load");
      });
    });
    describe("hotel page loads", () => {
      it("renders a list of hotels", () => {
        cy.get('[data-testid="hotels"] > li').should("have.length", 10);
      });
    });
  });
});
