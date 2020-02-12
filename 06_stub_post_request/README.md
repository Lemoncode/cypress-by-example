## Lets stub a post request with cypress. For this purpose we are going to create a new spec.

* Create __hotel-viewer/cypress/integration/hotel-edit-submission.spec.js__

```javascript
describe('Hotel edit form submission', () => {
    const newHotel = {
        id: 'Test id',
        picture: 'Test picture',
        name: 'Test hotel',
        description: 'This a foo description',
        city: 'Seattle',
        address: 'Foo address',
        rating: 4
    };

    it('Adds a new hotel', () => {
        // Stub http post new hotel
        cy.server();
        cy.route(
            'POST',
            'http://localhost:3000/api/hotels',
            newHotel
        ).as('create');
    });
});
```

* We have to stub cities combo, so we're going to stub this XHR call, and add a new command to visit the page:

```diff
describe('Hotel edit form submission', () => {
    const newHotel = {
        id: 'Test id',
        picture: 'Test picture',
        name: 'Test hotel',
        description: 'This a foo description',
        city: 'Seattle',
        address: 'Foo address',
        rating: 4
    };

    it('adds a new hotel', () => {
        cy.server();
        cy.route(
            'POST',
            'http://localhost:3000/api/hotels',
            newHotel,
        ).as('create');
+       cy.route('GET', 'http://localhost:3000/api/cities', ['Seattle', 'Birgluman']);
+       cy.visit('/#/hotel-edit/new');
    });
});
```

* Let's give it a try.

* Now it's time to fill the form:

```javascript
describe('Hotel edit form submission', () => {
    const newHotel = {
        id: 'Test id',
        picture: 'Test picture',
        name: 'Test hotel',
        description: 'This a foo description',
        city: 'Seattle',
        address: 'Foo address',
        rating: 4
    };

    it('Adds a new hotel', () => {
        cy.server();
        cy.route(
            'POST',
            'http://localhost:3000/api/hotels',
            newHotel
        ).as('create');
        cy.route('GET', 'http://localhost:3000/api/cities', ['Seattle', 'Birgluman']);
        cy.visit('/#/hotel-edit/new');
        /*diff*/
        cy.get(':nth-child(1) > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.name);

        cy.get(':nth-child(1) > :nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.picture);
        cy.get('form > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.description);
        cy.get('.MuiSelect-root').click();
        cy.get('[data-value="Seattle"]').click();
        /*diff*/
    });
});
```
* The trickiest part is to get an option on multiselect, we go this way due to __material ui__. Now what we want is to post the new created hotel, because we're stubbing all calls, we have to access the hotels fixture and make that this reflect the new added hotel.

```javascript
describe('Hotel edit form submission', () => {
    const newHotel = {
        id: 'Test id',
        picture: 'Test picture',
        name: 'Test hotel',
        description: 'This a foo description',
        city: 'Seattle',
        address: 'Foo address',
        rating: 4
    };

    it('Adds a new hotel', () => {
        // Stub http post new hotel
        cy.server();
        cy.route(
            'POST',
            'http://localhost:3000/api/hotels',
            newHotel
        ).as('create');

        // load related data to get populated cities
        cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels');

        cy.visit('/#/hotel-edit/new');
        cy.get(':nth-child(1) > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.name);
        cy.get(':nth-child(1) > :nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.picture);
        cy.get('form > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.description);
        cy.get('.MuiSelect-root').click();
        cy.get('[data-value="Seattle"]').click();

        /*diff*/    
        cy.fixture('hotels').then((hotels) => {
            // Modify fixture  
            hotels.push(newHotel);
            cy.route('GET', 'http://localhost:3000/api/hotels', hotels).as('hotelAdded');
            cy.get('.MuiButton-label').click();
            cy.wait('@create');
            cy.wait('@hotelAdded');
        });
        /*diff*/
    });
});
```

* For last we only have to assert that the new number of hotels is updated.

```diff
cy.fixture('hotels').then((hotels) => {
    // Modify fixture  
    hotels.push(newHotel);
    cy.route('GET', 'http://localhost:3000/api/hotels', hotels).as('hotelAdded');
    cy.get('.MuiButton-label').click();
    cy.wait('@create');
    cy.wait('@hotelAdded');

+   cy.get('.HotelCollectionComponentInner-listLayout-248 > div')
+   .should('have.length', 3);
});
```
