Cypress.Commands.add('loadAndVisit', (data = 'fixture:hotels') => {
    cy.server();
    cy.route('GET', 'http://localhost:3000/api/hotels', data)
        .as('load');

    cy.visit('/#/hotel-collection');

    cy.wait('@load');
}); 