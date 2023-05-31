/// <reference types="Cypress" />

describe("Hotel edit form submission", () => {
  const newHotel = {
    id: "Test id",
    picture: "Test picture",
    name: "Test hotel",
    description: "This a foo description",
    city: "Seattle",
    address: "Foo address",
    rating: 4,
  };

  const cities = [
    {
      id: "Seattle",
      name: "Seattle",
    },
    {
      id: "Burlingame",
      name: "Burlingame",
    },
  ];

  it("Adds a new hotel", () => {
    cy.intercept("POST", "/api/hotels", newHotel).as("create");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");

    cy.get("#name").type(newHotel.name);
    cy.get("#address").type(newHotel.address);
    cy.get("#description").type(newHotel.description);

    cy.get("#city").click();
    cy.get('[data-value="Seattle"]').click();

    cy.fixture("hotels").then((hotels) => {
      hotels.push(newHotel);
      cy.intercept("GET", "/api/hotels", hotels).as("hotelAdded");
      cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();
      cy.wait("@create");
      cy.wait("@hotelAdded");

      cy.get('[data-testid="hotels"] > li').should("have.length", 3);
    });
  });

  it.only("shows an error message for failed submission", () => {
    // https://docs.cypress.io/api/commands/intercept
    cy.intercept("POST", "/api/hotels", {
      statusCode: 500,
      body: {},
    }).as("errors");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");

    cy.on('window:alert', cy.stub().as('alertStub'));

    /*Edit form*/
    cy.get("#name").type(newHotel.name);
    cy.get("#address").type(newHotel.address);
    cy.get("#description").type(newHotel.description);

    cy.get("#city").click();
    cy.get('[data-value="Seattle"]').click();
    /*Edit form*/

    cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();
    cy.wait('@errors');

    cy.get('@alertStub')
      .should('have.been.calledWith', 'Error on save hotel');
  });
});
