# Cypress Testing Library

We're going to install the `Cypress Testing Library`. The nice thing about this library, is the adoption of the semantic HTML and accesabilty

```
We try to only expose methods and utilities that encourage you to write tests that closely resemble how your web pages are used.

Utilities are included in this project based on the following guiding principles:

1. If it relates to rendering components, then it should deal with DOM nodes rather than component instances, and it should not encourage dealing with component instances.
2. It should be generally useful for testing the application components in the way the user would use it. We are making some trade-offs here because we're using a computer and often a simulated browser environment, but in general, utilities should encourage tests that use the components the way they're intended to be used.
3. Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty light-weight, simple, and understandable.
```

- [Guiding Principles](https://testing-library.com/docs/guiding-principles/)

```bash
npm install @testing-library/cypress --save-dev
```

> Update `e2e/cypress/tsconfig.json`

```diff
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
-   "types": ["cypress", "node", "./support"]
+   "types": ["cypress", "node", "./support", "@testing-library/cypress"]
  },
  "include": ["**/*.ts"]
}

```

This library it's going to include additional commands in `Cypress`, so we need to rgister it.

> Update `e2e/cypress/support/e2e.ts`

```diff
import './commands'
+import '@testing-library/cypress/add-commands'
```

Now we can start to use it. 

> Update `e2e/cypress/e2e/login.cy.ts`

```diff
context("user uses valid credentials", () => {
    it("navigates to hotel summary page", () => {
-   cy.get(`[type='text']`).type("admin");
+   cy.findByRole("textbox").type("admin");
-   cy.get(`[type='password']`).type("test");
+   cy.findByLabelText("Password").type("test");
    cy.get(`[type='submit']`).click();

    cy.url().should("include", "/hotel-collection");
    });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

## References

- [Library definitions](https://github.com/testing-library/cypress-testing-library/blob/main/types/index.d.ts)
- [Usage](https://github.com/testing-library/cypress-testing-library#usage)