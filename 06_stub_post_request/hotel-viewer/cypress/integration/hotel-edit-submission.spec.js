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
        cy.route('GET', 'http://localhost:3000/api/cities', ['Seattle', 'Birgluman']);
        cy.visit('/#/hotel-edit/new');

        cy.get(':nth-child(1) > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.name);
        cy.get(':nth-child(1) > :nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.picture);
        cy.get('form > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
            .type(newHotel.description);

        cy.get('.MuiSelect-root').click();
        cy.get('[data-value="Seattle"]').click();

        cy.fixture('hotels').then((hotels) => {
            hotels.push(newHotel);
            cy.route('GET', 'http://localhost:3000/api/hotels', hotels).as('hotelAdded');
            cy.get('.MuiButton-label').click();
            cy.wait('@create');
            cy.wait('@hotelAdded');
        });

        cy.get('.HotelCollectionComponentInner-listLayout-248 > div')
            .should('have.length', 3);
    });
});