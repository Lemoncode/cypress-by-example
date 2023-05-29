## In this demo we're going to create stub requests so we have repeatable tests. Lets start by creating a new test that will check the number of hotels that we expect to be loaded.

- Crete a new file **/cypress/hotel-viewer/cypress/integration/hotel-viewer-init.spec.js**

```javascript
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/#/hotel-collection");
    cy.get(".HotelCollectionComponentInner-listLayout-277 > div").should(
      "have.length",
      10
    );
  });
});
```

- The above code can be changed by something more robust, we can find the number of hotels using _data-testid_

```js
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/#/hotel-collection");
    cy.get('[data-testid="hotels"] > div').should("have.length", 10);
  });
});
```

- Modify _./src\pods\hotel\hotel-collection\hotel-collection.component.tsx_

```diff
const HotelCollectionComponentInner = (props: Props) => {
    const { hotelCollection, classes, onClickFilterOption } = props;
    return (
        <>
            <div className={classes.filterLayout}>
                <HotelFilterComponent onClickFilterOption={onClickFilterOption} />
            </div>
-           <div className={classes.listLayout}>
+           <div className={classes.listLayout} data-testid="hotels">
                {
                    hotelCollection.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)
                }
            </div>
        </>
    );
}
```

- If we run our app

```bash
npm run start:dev
```

- and start cypress in another terminal

```bash
npm run cypress
```

- We can check that our test is passing right now.

## The matter now is this test is tied up to our backend implementation, that is something that could be nice, specially in integration tests but in development time can be nasty. Lets change this to use a predictable behavior.

```diff
describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
+       cy.server();
+       cy.route('GET', 'http://localhost:3000/api/hotels', []);
        cy.visit('/#/hotel-collection');
        cy.get('.HotelCollectionComponentInner-listLayout-277 > div')
-           .should('have.length', 10);
+           .should('have.length', 0);
    });
});
```

- By now we are just passing an empty array.

- Lets mock the response with some values:

```javascript
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
    cy.server();
    /*diff*/
    cy.route("GET", "http://localhost:3000/api/hotels", hotels);
    /*diff*/
    cy.visit("/#/hotel-collection");
    cy.get(".HotelCollectionComponentInner-listLayout-94 > div")
      /*diff*/
      .should("have.length", 2);
    /*diff*/
  });
});
```

- _cy.server()_ enables stub requests.

- Our test is now passing with our stub values.

## Use stub requests is something that is going to do a lot. There's another approach to avoid this data to not to be in our tests directly. For that purpose we can use fixtures.

- Open the **fixtures folder** and add **hotels.json**

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

- Now we can go back to our spec, **cypress/integration/hotel-viewer-init.spec.js**

```diff
describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
-       const hotels = [
-           {
-               "id": "0248058a-27e4-11e6-ace6-a9876eff01b3",
-               "picture": "/thumbnails/50947_264_t.jpg",
-               "name": "Motif Seattle",
-               "description": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps                     from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
-               "address": "1415 5th Ave",
-               "rating": 4,
-           },
-           {
-               "id": "024bd61a-27e4-11e6-ad95-35ed01160e57",
-               "picture": "/thumbnails/16673_260_t.jpg",
-               "name": "The Westin Seattle",
-               "address": "1900 5th Ave",
-               "description": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle,                       steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
-               "rating": 4,
-           },
-       ];
        cy.server();
+       cy.fixture('hotels')
+           .then((hotels) => {
+               cy.route('GET', 'http://localhost:3000/api/hotels', hotels);
+           });
-       cy.route('GET', 'http://localhost:3000/api/hotels', hotels);
        cy.visit('/#/hotel-collection');
        cy.get('.HotelCollectionComponentInner-listLayout-92 > div')
            .should('have.length', 2);
    });
});
```

- This is working but is really a common pattern that cypress offers another alternative:

```diff
describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
        cy.server();
-       cy.fixture('hotels')
-           .then((hotels) => {
-               cy.route('GET', 'http://localhost:3000/api/hotels', hotels);
-           });
+       cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels');
        cy.visit('/#/hotel-collection');
        cy.get('.HotelCollectionComponentInner-listLayout-92 > div')
            .should('have.length', 2);
    });
});
```
