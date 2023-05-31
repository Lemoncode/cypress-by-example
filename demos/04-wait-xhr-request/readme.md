# Wait XHR Request

Lets supose that we have a really long delay to perform our XHR request (loading other data, or some kind of that staff), what will happen with our test? Lets modify our code and have a look on this:

> Modify `hotel-viewer/src/pods/hotel-collection/api/hotel-collection.api.ts`

```ts
import Axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

/*diff*/
const delay = (offset: number) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(void 0);
  }, offset);
});
/*diff*/

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await Axios.get<HotelEntityApi[]>(url);
  /*diff*/
  await delay(4000);
  /*diff*/
  return data;
};
```

* We just wrap up our load function on a `setTimout` function with a 4 seconds delay, that is a bigger delay that cyppress is going to apply for tests.

> If we run our test is going to crash. Cypress applies around 3 seconds waiting for a request.

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`


To fix this we can use some cypress goodies:

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.js`

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
    cy.visit("/hotel-collection");
-   cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" });
+   cy.intercept("GET", "/api/hotels", { fixture: "hotels.json" }).as("load");
+   cy.wait('@load');
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});

```

1. We create an alias for this request.
2. We tell cypress that waits for the aliased request. Will wait until this request is done.

Let's remove delay to don't have issues in future demos:

> Update `hotel-viewer/src/pods/hotel-collection/api/hotel-collection.api.ts`

```diff
export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await Axios.get<HotelEntityApi[]>(url);
- await delay(4000);
  return data;
};
```