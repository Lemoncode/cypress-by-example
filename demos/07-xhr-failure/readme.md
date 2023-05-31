# XHR Failure

In this demo we're going to emulate an error on an HttpRequest.

The first thing that we need, is to create a new request that produce an error. 

First we need to update our code to handle exceptions. Lets change `handleSave` function.

> Update `hotel-viewer/src/pods/hotel-edit/hotel-edit.container.tsx`

```ts
// ....
const handleSave = async (hotel: Hotel) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
    
    try {
      if (isEditMode(id)) {
        await api.updateHotel(apiHotel)
      } else {
        await api.saveHotel(apiHotel);
      }
      navigate(linkRoutes.hotelCollection);
    } catch (error) {
      alert('Error on save hotel');
    }
  };
// ....
```


We are ready to create a new test, that throws an exception.

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```javascript
/// <reference types="Cypress" />

describe("Hotel edit form submission", () => {
  //....
  /*diff*/
  it.only("shows an error message for failed submission", () => {
    // https://docs.cypress.io/api/commands/intercept
    cy.intercept("POST", "/api/hotels", {
      statusCode: 500,
      body: {},
    }).as("errors");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");

    /*Edit form*/
    cy.get("#name").type(newHotel.name);
    cy.get("#address").type(newHotel.address);
    cy.get("#description").type(newHotel.description);

    cy.get("#city").click();
    cy.get('[data-value="Seattle"]').click();
    /*Edit form*/

    cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();
    cy.wait('@errors');
  });
  /*diff*/
});

```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

Hummm, seems to work, but we can't see any `alert` from browser. What is going on, is that `Cypress` is not going to render any `alert`, but that doesn't mean that it's not called.

What we're going to do is `stub`, the event, when `alert` is called, and check that is being called with the expected text.

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```diff
  it.only("shows an error message for failed submission", () => {
    cy.intercept("POST", "/api/hotels", {
      statusCode: 500,
      body: {},
    }).as("errors");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");

+   cy.on('window:alert', cy.stub().as('alertStub'));

    /*Edit form*/
    cy.get("#name").type(newHotel.name);
    cy.get("#address").type(newHotel.address);
    cy.get("#description").type(newHotel.description);

    cy.get("#city").click();
    cy.get('[data-value="Seattle"]').click();
    /*Edit form*/

    cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();
    cy.wait('@errors');

+   cy.get('@alertStub')
+     .should('have.been.calledWith', 'Error on save hotel');
  });
```