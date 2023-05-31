declare namespace Cypress {
  interface Chainable {
    loadAndVisit(data?: string): Chainable<Element>;
  }
}
