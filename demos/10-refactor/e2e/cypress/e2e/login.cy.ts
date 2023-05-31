describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("focuses the input name on load", () => {
    cy.get("[type='text']").should("have.focus");
  });

  it("name accepts input", () => {
    const typedText = "admin";
    cy.get("#name").type(typedText).should("have.value", typedText);
  });

  describe("smoke test", () => {
    context("user uses valid credentials", () => {
      it("navigates to hotel summary page", () => {
        cy.get(`[type='text']`).type("admin");
        cy.get(`[type='password']`).type("test");
        cy.get(`[type='submit']`).click();

        cy.url().should("include", "/hotel-collection");
      });
    });

    context("user uses invalid credentials", () => {
      it('shows an alert', () => {
        cy.get(`[type='text']`).type("admini");
        cy.get(`[type='password']`).type("teeeest");
        cy.get(`[type='submit']`).click();

        cy.on('window:alert', cy.stub().as('alertStub'));
        cy.get('@alertStub')
          .should('not.have.been.calledWith', 'invalid credentials');
      });
    });
  });
});
