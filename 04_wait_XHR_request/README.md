## Lets supose that we have a really long delay to perform our XHR request (loading other data, or some kind of that staff),  what will happen with our test? Lets modify our code and have a look on this:

* Modify __./src/pods/hotel/hotel-collection/hotel-collection.api.ts__ as follows:

```diff
import Axios from 'axios';
import { baseApiUrl } from 'core';
import { HotelEntityModel } from '../api/api.model';


const getHotelsUrl = `${baseApiUrl}/api/hotels`;

// TODO: Just only managing the "happy path", adding error handling here or upper level 
// would be a good idea
export const getHotelCollection = (): Promise<HotelEntityModel[]> => {
  const promise = new Promise<HotelEntityModel[]>((resolve, _) =>
    Axios.get<HotelEntityModel[]>(getHotelsUrl)
      .then(
-       (response) => resolve(response.data)
+       (response) => setTimeout(() => resolve(response.data), 4000) 
      )
  );

  return promise;
}
```

* We just wrap up our load function on a setTimout function with a 5 seconds delay, that is a bigger delay that cyppress is going to apply for tests.

* If we run our test is going to crash. Cypress applies around 3 seconds waiting for a request.

* To fix this we can use some cypress goodies:

```diff
describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
        cy.server();
        cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels')
+         .as('load'); // [1]
        
        cy.visit('/#/hotel-collection');

+       cy.wait('@load'); // [2]

        cy.get('.HotelCollectionComponentInner-listLayout-92 > div')
            .should('have.length', 2);
    });
});
```

1. We create an alias for this request.
2. We tell cypress that waits for the aliased request. Will wait until this reques is done.

* Let's remove delay to don't have issues in future demos:

```diff
import Axios from 'axios';
import { baseApiUrl } from 'core';
import { HotelEntityModel } from '../api/api.model';


const getHotelsUrl = `${baseApiUrl}/api/hotels`;

// TODO: Just only managing the "happy path", adding error handling here or upper level 
// would be a good idea
export const getHotelCollection = (): Promise<HotelEntityModel[]> => {
  const promise = new Promise<HotelEntityModel[]>((resolve, _) =>
    Axios.get<HotelEntityModel[]>(getHotelsUrl)
      .then(
-       (response) => setTimeout(() => resolve(response.data), 4000) 
+       (response) => resolve(response.data)
      )
  );

  return promise;
}
```