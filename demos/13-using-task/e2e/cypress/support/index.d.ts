declare namespace Cypress {
  interface Resource {
    path: string;
    fixture?: string;
    alias?: string;
  }

  interface Chainable {
    loadAndVisit(data?: string): Chainable<Element>;
    loadAndVisitV2(
      apiPath: string,
      routePath: string,
      fixture?: string
    ): Chainable<Element>;
    loadAndVisitV3(
      visitUrl: string,
      resources: Resource[],
      callbackAfterVisit?: () => void
    ): Chainable<Element>;
  }
}
