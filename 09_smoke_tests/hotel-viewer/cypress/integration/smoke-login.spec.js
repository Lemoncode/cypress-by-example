describe('Login smoke test', () => {
    describe('User login in application', () => {
        context('user uses valid credentials', () => {
            it('navigates to hotel summary page', () => {
                cy.visit('/');

                cy.get(`[type='text']`)
                    .type('admin');

                cy.get(`[type='password']`)
                    .type('test');

                cy.get('.MuiButtonBase-root')
                    .click();

                cy.url().should('include', '/#/hotel-collection');
            });
        });

        context('user uses invalid credentials', () => {
            it('shows an alert', () => {
                cy.visit('/');

                cy.get(`[type='text']`)
                    .type('admin');

                cy.get(`[type='password']`)
                    .type('text');

                cy.get('.MuiButtonBase-root')
                    .click();
                
                cy.on('window:alert', (text) => {
                    expect(text).to.equal('invalid credentials');
                });
            });
        });
        
    });
});