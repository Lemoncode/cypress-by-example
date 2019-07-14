## We're going to create a new spec to check that hotels are filtered.

* We're going to create a new fixture with more data to test all our options, create __./hotel-viewer/cypress/fixtures/hotels-extended.json__

```json
[
    {
        "id": "0248058a-27e4-11e6-ace6-a9876eff01b3",
        "picture": "/thumbnails/50947_264_t.jpg",
        "name": "Motif Seattle",
        "city": "Seattle",
        "shortDescription": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
        "address": "1415 5th Ave",
        "hotelRating": 2
    },
    {
        "id": "024bd61a-27e4-11e6-ad95-35ed01160e57",
        "picture": "/thumbnails/16673_260_t.jpg",
        "name": "The Westin Seattle",
        "city": "Burmiggan", 
        "address": "1900 5th Ave",
        "shortDescription": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
        "hotelRating": 4
    },
    {
        "id": "0248058a-27e4-11e6-ace6-a9876eff01cd",
        "picture": "/thumbnails/50947_264_t.jpg",
        "name": "Seattle Marina",
        "city": "Seattle",
        "shortDescription": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
        "address": "1415 5th Ave",
        "hotelRating": 1
    },
    {
        "id": "024bd61a-27e4-11e6-ad95-35ed01160eff",
        "picture": "/thumbnails/16673_260_t.jpg",
        "name": "The Eastin Seattle",
        "city": "Burmiggan", 
        "address": "1900 5th Ave",
        "shortDescription": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
        "hotelRating": 3
    }
]
```

* Create a new spec file __./hotel-viewer/cypress/integration/hotel-viewer-filter.spec.js__

```javascript
describe('Filter panel', () => {
    it('filters hotels by rating', () => {
        cy.loadAndVisit('fixture:hotels-extended'); // [1]
    });
});
```
1. We're passing the new extended fixture. We can run this and see if it works.

* Now lets find a button and click on it. One strategy is to use __contains__. This command will find what ever inner text inside an HTML element and retrieve to us.

```javascript
describe('Filter panel', () => {
    it('filters hotels by rating', () => {
        cy.loadAndVisit('fixture:hotels-extended');

        cy.contains('bad').click(); // [2]
    });
});
```

2. Because we're using __material-ui__ the inner text is transform and we see it on upper case.

* We can assert now

```javascript
describe('Filter panel', () => {
    it('filters hotels by rating', () => {
        cy.loadAndVisit('fixture:hotels-extended');

        cy.contains('bad').click();

        cy.get('.HotelCollectionComponentInner-listLayout-94 > div')
            .should('have.length', 2); // [1]
    });
});
```

1. Because we have filtered, we're expecting that this list have two items.

* Now we can create segragate tests for each filter value or instead use a cypress feature that avoid code duplication

```javascript
describe('Filter panel', () => {
    it('filters hotels by rating', () => {
        cy.loadAndVisit('fixture:hotels-extended');

        const filters = [ // [1]
            { value: 'all', expectedLength: 4 },
            { value: 'bad', expectedLength: 2 },
            { value: 'good', expectedLength: 1 },
            { value: 'excellent', expectedLength: 1 },
        ];

        cy.wrap(filters) // [2]
            .each((filter) => { // [3]
                const { value, expectedLength } = filter;
                cy.contains(value).click();
        
                cy.get('.HotelCollectionComponentInner-listLayout-94 > div')
                    .should('have.length', expectedLength); 
            });
    });
});
```

1. We create a new array of objects. The fields that we're using are value (filtering value) and expectedLenght (the length expectation after filtering).
2. Then we user __wrap__, this will allow us to use __each__.
3. For last in each iteration we access an onbject of filters array. Is inside this callback where we do the test.