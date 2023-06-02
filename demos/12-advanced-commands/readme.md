# Advanced Commands

We have already created a custom command that allow us to visit and load data, for `hotel-collection`. This type of pattern is common on applications. We visit a page, and we need to ensure that the data is loaded, to start our tests.

> Before start the demo, recall to update `backend/db.json` with all hotels version.

> Open `e2e/cypress/support/commands.ts`

```ts
Cypress.Commands.add("loadAndVisit", (data = "hotels.json") => {
  cy.visit("/hotel-collection");
  cy.intercept("GET", "/api/hotels", { fixture: data }).as("load");
  cy.wait("@load");
});
```

Can we build something more generic? The answer is yes, so lets get started.

> Update `e2e/cypress/support/commands.ts`

```ts
/*diff*/
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
/*diff*/
```

Now we must update the types, so TS could be happy.

> Update `e2e/cypress/support/index.d.ts`

```ts
declare namespace Cypress {
  interface Chainable {
    loadAndVisit(data?: string): Chainable<Element>;
    /*diff*/
    loadAndVisitV2(
      apiPath: string,
      routePath: string,
      fixture?: string
    ): Chainable<Element>;
    /*diff*/
  }
}
```

Ok lets test this new approach, for that we are going to create a new test (just to have a seggregate test with this approach).

> Create `e2e/cypress/e2e/hotel-viewer-init-v2.cy.ts`

```ts
describe("Hotel collection specs", () => {
  it("should fetch hotel list and show it in screen when visit /hotel-collection url", () => {
    // Arrange

    // Act
    cy.loadAndVisitV2("/api/hotels", "/hotel-collection");

    // Assert
    cy.findAllByRole("listitem").should("have.length", 10);
  });

  it("should fetch hotel list greater than 0 when visit /hotel-collection url", () => {
    // Arrange

    // Act
    cy.loadAndVisitV2("/api/hotels", "/hotel-collection");

    // Assert
    cy.findAllByRole("listitem").should("have.length.greaterThan", 0);
  });

  it("should fetch two hotels when visit /hotel-collection url", () => {
    // Arrange

    // Act
    cy.loadAndVisitV2("/api/hotels", "/hotel-collection", "hotels.json");

    // Assert
    cy.findAllByRole("listitem").should("have.length", 2);
  });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

Nice, it works. But you know what, we can get this even further. In order to explore more advanced commands we are going to create a new test for hotel edition.

> Create `e2e/cypress/e2e/hotel-edit-submission-v2.cy.ts`

```ts
describe("Hotel edit specs", () => {
  it("should navigate to second hotel when click on edit second hotel", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Do you recall how we get to the hotel edit form? We were using a button that was a pen icon. Bear in mind that this is not a good approach froma accessibility point of view, lets fix that.

> EXERCISE: Figure out what can we use to make the `IconButton` component more accesible.

> Update `hotel-viewer/src/pods/hotel-collection/components/hotel-card.component.tsx`

```diff
...
    <CardActions>
      <IconButton
+       aria-label="Edit hotel"
        onClick={() => history.push(linkRoutes.hotelEdit(hotel.id))}
      >
        <EditIcon />
      </IconButton>
    </CardActions>
```

Lets now write our test.

> Update `e2e/cypress/e2e/hotel-edit-submission-v2.cy.ts`

```diff
...
  it('should navigate to second hotel when click on edit second hotel', () => {
    // Arrange

    // Act
+   cy.loadAndVisit('/api/hotels', '/hotel-collection');
+   cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
+     $buttons[1].click();
+   });

    // Assert
+   cy.url().should('equal', 'http://localhost:8080/#/hotel-edit/024bd61a-27e4-11e6-ad95-35ed01160e57');
  });

```

> Since cypress v10 $ prefix in elements is required. If it is not added the spec may fail.
> [Official docs](https://docs.cypress.io/api/commands/then)

Lets check that works. Nice now we are going to update the spec with a simple edition.

> Update `e2e/cypress/e2e/hotel-edit-submission-v2.cy.ts`

```diff
...
+ it('should update hotel name when it edits an hotel and click on save button', () => {
+   // Arrange

+   // Act
+   cy.loadAndVisit('/api/hotels', '/hotel-collection');

+   cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
+     $buttons[1].click();
+   });

+   cy.findByLabelText('Name').clear().type('Updated hotel two');

+   cy.findByRole('button', { name: 'Save' }).click();

+   // Assert
+   cy.findByText('Updated hotel two');
+ });
```

Could be situations where band width, could be really poor, and the previous test can fail because of this. Lets refactor with this scenario on mind.

> Update `e2e/cypress/e2e/hotel-edit-submission-v2.cy.ts`

```diff
...
  it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange

    // Act
    cy.loadAndVisit('/api/hotels', '/hotel-collection');

+   cy.intercept('GET', '/api/hotels/024bd61a-27e4-11e6-ad95-35ed01160e57').as('loadHotel');

    cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
      $buttons[1].click();
    });

+   cy.wait('@loadHotel');
+   cy.findByLabelText('Name').should('not.have.value', '');

    cy.findByLabelText('Name').clear().type('Updated hotel two');

    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
+   cy.wait('@load'); // TODO: Refactor custom command loadAndVisit
    cy.findByText('Updated hotel two');
  });
```

> Notice: some of these requests have to wait until they have some value.
> [Wait default timeouts](https://docs.cypress.io/api/commands/wait#Timeouts)

Lets create a command that handles this kind of situation, where we need to wait for more that a single resource.

> Update `e2e/cypress/support/commands.ts`

```ts
/*diff*/
interface Resource {
  path: string;
  fixture?: string;
  alias?: string;
}

Cypress.Commands.add(
  "loadAndVisitV3",
  (
    visitUrl: string,
    resources: Resource[],
    callbackAfterVisit?: () => void
  ) => {
    const aliasList = resources.map((resource, index) => {
      const alias = resource.alias || `load-${index}`;
      Boolean(resource.fixture)
        ? cy
            .intercept("GET", resource.path, { fixture: resource.fixture })
            .as(alias)
        : cy.intercept("GET", resource.path).as(alias);

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
/*diff*/
```

> Update `e2e/cypress/support/index.d.ts`

```ts
declare namespace Cypress {
  /*diff*/
  interface Resource {
    path: string;
    fixture?: string;
    alias?: string;
  }
  /*diff*/
  interface Chainable {
    loadAndVisit(data?: string): Chainable<Element>;
    loadAndVisitV2(
      apiPath: string,
      routePath: string,
      fixture?: string
    ): Chainable<Element>;
    /*diff*/
    loadAndVisitV3(
      visitUrl: string,
      resources: Resource[],
      callbackAfterVisit?: () => void
    ): Chainable<Element>;
    /*diff*/
  }
}
```

Lets check that our update works.

> Update `e2e/cypress/e2e/hotel-edit-submission-v2.cy.ts`

```diff
it('should update hotel name when it edits an hotel and click on save button', () => {
    // Arrange

    // Act
-   cy.loadAndVisitV2('/api/hotels', '/hotel-collection');
+   cy.loadAndVisitV3(
+     '/hotel-collection',
+     [
+       { path: '/api/hotels', alias: 'loadHotels' },
+       { path: '/api/hotels/024bd61a-27e4-11e6-ad95-35ed01160e57' },
+       { path: '/api/cities' },
+     ],
+     () => {
+       cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
+         $buttons[1].click();
+       });
+     }
+   );

-   cy.intercept('GET', '/api/hotels/024bd61a-27e4-11e6-ad95-35ed01160e57').as('loadHotel');

-   cy.findAllByRole('button', { name: 'Edit hotel' }).then(($buttons) => {
-     $buttons[1].click();
-   });

-   cy.wait('@loadHotel');

    cy.findByLabelText('Name').should('not.have.value', '');

    cy.findByLabelText('Name').clear().type('Updated hotel two');

    cy.findByRole('button', { name: 'Save' }).click();

    // Assert
-   cy.wait('@load'); // TODO: Refactor custom command loadAndVisit
+   cy.wait('@loadHotels');
    cy.findByText('Updated hotel two');
  });
```