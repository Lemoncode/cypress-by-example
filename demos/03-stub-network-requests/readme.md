# Stub Network Requests

In this demo we're going to create stub requests so we have repeatable tests. Lets start by creating a new test that will check the number of hotels that we expect to be loaded.

> Crete a new file `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```javascript
/// <reference types="Cypress" />

describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
  });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

We can use the bullseye to make target on desired elements, the hotel collection, and update our test.

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit('/hotel-collection');
+   cy.get('.css-1l9n8tn-root-root')
  });
});
```

What we want it's to check the number of hotels, we can achieve that just by getting the first chldren on previous selector that are `li` elements.

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
-   cy.get(".css-1l9n8tn-root-root > li");
+   cy.get(".css-1l9n8tn-root-root > li").should("have.length", 10);
  });
});
```

The above code can be changed by something more robust, we can find the number of hotels using _data-testid_

> Update `hotel-viewer/src/pods/hotel-collection/hotel-collection.component.tsx`

```diff
.....
- <ul className={classes.root}>
+ <ul className={classes.root} data-testid="hotels">
      {hotelCollection.map((hotel) => (
        <li key={hotel.id}>
          <HotelCard hotel={hotel} />
        </li>
      ))}
    </ul>
  );
....
```

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```js
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
    /*diff*/
    cy.get('[data-testid="hotels"] > li').should("have.length", 10);
    /*diff*/
  });
});
```

> We can check that our test is passing right now.

The matter now, is that this test, is tied up to our backend implementation, that is something that could be nice, specially in integration tests but in development time can be nasty. Lets change this to use a predictable behavior.

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
+   cy.intercept('GET', '/api/hotels', []);
-   cy.get('[data-testid="hotels"] > li').should("have.length", 10);
+   cy.get('[data-testid="hotels"] > li').should("have.length", 0);
  });
});
```

By now we are just passing an empty array. Lets mock the response with some values:

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```js
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    /*diff*/
    const hotels = [
      {
        id: "0248058a-27e4-11e6-ace6-a9876eff01b3",
        picture: "/thumbnails/50947_264_t.jpg",
        name: "Motif Seattle",
        description:
          "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
        address: "1415 5th Ave",
        rating: 4,
      },
      {
        id: "024bd61a-27e4-11e6-ad95-35ed01160e57",
        picture: "/thumbnails/16673_260_t.jpg",
        name: "The Westin Seattle",
        address: "1900 5th Ave",
        description:
          "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
        rating: 4,
      },
    ];
    /*diff*/

    cy.visit("/hotel-collection");
    /*diff*/
    cy.intercept("GET", "/api/hotels", hotels);
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
    /*diff*/
  });
});
```

> `cy.intercep()` Spy and stub network requests and responses.

Our test is now passing with our stub values.

Use stub requests is something that is going to do a lot. There's another approach to avoid this data to not to be in our tests directly. For that purpose we can use fixtures.

> Open the `e2e/cypress/fixtures` and add `hotels.json`

```json
[
  {
    "id": "0248058a-27e4-11e6-ace6-a9876eff01b3",
    "picture": "/thumbnails/50947_264_t.jpg",
    "name": "Motif Seattle",
    "description": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
    "address": "1415 5th Ave",
    "rating": 4
  },
  {
    "id": "024bd61a-27e4-11e6-ad95-35ed01160e57",
    "picture": "/thumbnails/16673_260_t.jpg",
    "name": "The Westin Seattle",
    "address": "1900 5th Ave",
    "description": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
    "rating": 4
  }
]
```

Now we can go back to our test, and use the new fixture.

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
-   const hotels = [
-     {
-       id: "0248058a-27e4-11e6-ace6-a9876eff01b3",
-       picture: "/thumbnails/50947_264_t.jpg",
-       name: "Motif Seattle",
-       description:
-         "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
-       address: "1415 5th Ave",
-       rating: 4,
-     },
-     {
-       id: "024bd61a-27e4-11e6-ad95-35ed01160e57",
-       picture: "/thumbnails/16673_260_t.jpg",
-       name: "The Westin Seattle",
-       address: "1900 5th Ave",
-       description:
-         "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
-       rating: 4,
-     },
-   ];

    cy.visit("/hotel-collection");
-   cy.intercept("GET", "/api/hotels", hotels);
+   cy.fixture('hotels').then((hotels) => {
+       cy.intercept("GET", "/api/hotels", hotels);
+   });
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
```

This is working but, is really a common pattern that `Cypress` offers another alternative:

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
-   cy.fixture("hotels").then((hotels) => {
-     cy.intercept("GET", "/api/hotels", hotels);
-   });
+   cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" });
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
```
