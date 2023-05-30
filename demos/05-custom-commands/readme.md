# Custom Commands

If we have a look into our code we will notice that there some steps that we're going to want to repeat over the tests:

```javascript
/// <reference types="Cypress" />

describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    /* custom candidate */
    cy.visit("/hotel-collection");
    cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" }).as("load");
    cy.wait("@load");
    /* custom candidate */
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
```

The lines of code surround by **custom candidate comments** are the ones to be repeated over the tests.

We can open/create **e2e/cypress/support/commands.js** and create a new command as follows.

> Update `e2e/cypress/support/commands.js`

```javascript
Cypress.Commands.add("loadAndVisit", () => {
  cy.visit("/hotel-collection");
  cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" }).as("load");
  cy.wait("@load");
});
```

In previous verions of `Cypress` what was in this folder has to be exposed to cypress, so we have to create a barrel and import `commands`. Now `Cypress` does this for us, we can check by opening `e2e/cypress/support/e2e.js`.

```javascript
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
```

Now we can go back to our test and use the new command, lets modify our test.

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
-   cy.visit("/hotel-collection");
-   cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" }).as("load");
-   cy.wait('@load');
+   cy.loadAndVisit();
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

Let's say now, that I want to be more flexible with the initial data in our custom command, what I need is feed this data, we can do this, by feeding params to our callback function. 

> Update `e2e/cypress/support/commands.js`

```diff
-Cypress.Commands.add('loadAndVisit', () => {
+Cypress.Commands.add('loadAndVisit', (data = 'hotels.json') => {
-   cy.intercept('GET', '/api/hotels', 'fixture:hotels')
+   cy.intercept('GET', '/api/hotels', data)
        .as('load');
    cy.visit('/hotel-collection');
    cy.wait('@load');
});
```

Notice that by defult we're consuming the fixture. Lets give a try and see that stills working.
