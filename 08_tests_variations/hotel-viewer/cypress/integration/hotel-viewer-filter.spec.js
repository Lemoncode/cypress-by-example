describe('Filter panel', () => {
    it('hotels by rating', () => {
        cy.loadAndVisit('fixture:hotels-extended');

        const filters = [
            { value: 'all', expectedLength: 4 },
            { value: 'bad', expectedLength: 2 },
            { value: 'good', expectedLength: 1 },
            { value: 'excellent', expectedLength: 1 },
        ];

        cy.wrap(filters)
            .each((filter) => {
                const { value, expectedLength } = filter;
                cy.contains(value).click();

                cy.get('.HotelCollectionComponentInner-listLayout-94 > div')
                    .should('have.length', expectedLength);
            });
    });
});