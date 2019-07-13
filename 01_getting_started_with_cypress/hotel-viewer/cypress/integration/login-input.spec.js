describe('Login input', () => {
    it('visits the login page', ()  => {
        cy.visit('/');
    });

    it('focuses the input name on load', () => {
        cy.visit('/');
        cy.get("[type='text']")
            .should('have.focus');
    });
});