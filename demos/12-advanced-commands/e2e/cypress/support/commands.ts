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

Cypress.Commands.add("loadAndVisit", (data = "hotels.json") => {
  cy.visit("/hotel-collection");
  cy.intercept("GET", "/api/hotels", { fixture: data }).as("load");
  cy.wait("@load");
});

Cypress.Commands.add(
  "loadAndVisitV2",
  (apiPath: string, routePath: string, fixture?: string) => {
    Boolean(fixture)
      ? cy.intercept("GET", apiPath, { fixture }).as("load")
      : cy.intercept("GET", apiPath).as("load");

    cy.visit(routePath);
    cy.wait("@load");
  }
);

interface Resource {
  path: string;
  fixture?: string;
  alias?: string;
}

Cypress.Commands.add(
  "loadAndVisitV3",
  (visitUrl: string, resources: Resource[], callbackAfterVisit?: () => void) => {
    const aliasList = resources.map((resource, index) => {
      const alias = resource.alias || `load-${index}`;
      Boolean(resource.fixture)
        ? cy
            .intercept('GET', resource.path, { fixture: resource.fixture })
            .as(alias)
        : cy.intercept('GET', resource.path).as(alias);

      return alias;
    });

    cy.visit(visitUrl);
    if (callbackAfterVisit) {
      callbackAfterVisit();
    }

    aliasList.forEach((alias) => {
      cy.wait(`@${alias}`);
    });
  }
);
