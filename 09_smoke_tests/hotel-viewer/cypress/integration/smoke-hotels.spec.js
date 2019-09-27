describe('Hotels smoke tests', () => {
    describe('Hotel form', () => {
        const newHotel = {
            id: 'Test id',
            picture: 'Test picyture',
            name: 'Test hotel',
            description: 'This is a foo description',
            city: 'Seattle',
            address: 'Foo address',
            rating: 4,
        };

        beforeEach(() => {
            cy.request('DELETE', 'http://localhost:3000/api/hotels/all');
        });

        context('user fullfils form valid fields', () => {
            describe('user clicks on save', () => {
                it('adds a new hotel', () => {
                    // Arrange
                    cy.server();
                    cy.route('POST', 'http://localhost:3000/api/hotels')
                        .as('create');
                    cy.route('GET', 'http://localhost:3000/api/cities')
                        .as('load');

                    cy.visit('/#/hotel-edit/new');
                    cy.wait('@load');

                    // Act
                    // Type name
                    cy.get(':nth-child(1) > :nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
                        .type(newHotel.name);

                    // Type picture    
                    cy.get(':nth-child(1) > :nth-child(3) > .MuiInputBase-root > .MuiInputBase-input')
                        .type(newHotel.picture);

                    // Type description
                    cy.get('form > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
                        .type(newHotel.description);

                    // Select city
                    cy.get('.MuiSelect-root').click();
                    cy.get('[data-value="Seattle"]').click();

                    cy.get('.MuiButton-label').click();

                    cy.wait('@create');

                    // Assert
                    cy.get('.HotelCollectionComponentInner-listLayout-248 > div')
                        .should('have.length', 1);
                });
            });
        });
    });

    describe('Hotel viewer', () => {
        beforeEach(() => {
            cy.fixture('hotels-server')
                .then((hotels) => {
                    cy.request(
                        'POST',
                        'http://localhost:3000/api/hotels/bulkload',
                        { hotels }
                    );
                    cy.server();
                    cy.route('GET', 'http://localhost:3000/api/hotels').as('load');
                    cy.visit('/#/hotel-collection');
                    cy.wait('@load');
                });
        });
        describe('hotel page loads', () => {
            it('renders a list of hotels', () => {
                cy.get('.HotelCollectionComponentInner-listLayout-94 > div') // cy.get('.HotelCollectionComponentInner-listLayout-94')
                    .should('have.length', 10);
            });
        });
    });
});