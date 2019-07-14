describe('Hotel viewer initialization', () => {
    it('displays hotels on page load', () => {
        // cy.server();
        // cy.route('GET', 'http://localhost:3000/api/hotels', 'fixture:hotels')
        //     .as('load');
        
        // cy.visit('/#/hotel-collection');
        
        // cy.wait('@load');
        cy.loadAndVisit();

        cy.get('.HotelCollectionComponentInner-listLayout-94 > div')
            .should('have.length', 2);
    });
});

