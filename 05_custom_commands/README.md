## If we have a look into our code we will notice that there some steps that we're going to want to repeat over the tests:

```javascript
describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
        //=custom candidate
        cy.server();
        cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels')
            .as('load');
        
        cy.visit('/#/hotel-collection');
        
        cy.wait('@load');
        //#custom candidate
        cy.get('.HotelCollectionComponentInner-listLayout-94 > div')
            .should('have.length', 2);
    });
});
```

* The lines of code surround by __custom candidate commeents__ are the ones to be repeated over the tests.
* We can open/create __./hotel-viewer/cypress/support/commands.js__ and create a new command as follows:

```javascript
Cypress.Commands.add('loadAndVisit', () => {
    cy.server();
    cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels')
        .as('load');
    
    cy.visit('/#/hotel-collection');

    cy.wait('@load');
});

```

* What is in this folder has to be exposed to cypress, so we have to create a barrel __./hotel-viewer/cypress/support/index.js__

```javascript
import './commands';
```

* Now we can go back to our test and use the new command, lets modify __./hotel-viewer/cypress/integration/hotel-viewer-init.spec.js__

```diff
describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
-        cy.server();
-        cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels')
-          .as('load');
+        
-        cy.visit('/#/hotel-collection');
+
-       cy.wait('@load');
+       cy.loadAndVisit();
+
        cy.get('.HotelCollectionComponentInner-listLayout-92 > div')
            .should('have.length', 2);
    });
});
```

* Lets give it a try.

* Lets say that I want to be more flexible with the initial data in our custom command, what I need is feed this data, we can do this, by feeding params to our callback function. Lets modify __./hotel-viewer/cypress/support/commands.js__

```diff
-Cypress.Commands.add('loadAndVisit', () => {
+Cypress.Commands.add('loadAndVisit', (data = 'fixture:hotels') => {
    cy.server();
-   cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels')
+   cy.route('GET', 'http://localhost:3000/api/hotels', data)
        .as('load');
    
    cy.visit('/#/hotel-collection');

    cy.wait('@load');
});
```

* Notice that by defult we're consuming the fixture. Lets give a try and see that stills working.