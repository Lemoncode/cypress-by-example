describe('Login input', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('focuses the input name on load', () => {
        cy.get("[type='text']")
            .should('have.focus');
    });

    it('name accepts input', () => {
        const typedText = 'admin';
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
            .type('admin')
            .should('have.value', typedText);
    });
});