# Refactor

In this demo we're going to update our tests to use the TypeScript and Cypress Testing Library.

Migrating to typescript must be pretty straight forward. We did not talk about it, but `Cypress` comes with TypeScript support out of the box. 

> Open `e2e/cypress.config.js`

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    baseUrl: 'http://localhost:8080/#'
  },
});

```

How does `Cypress` know, what are the files to be executed on tests? There's a default convention, that we can update on this file:

> Update `e2e/cypress.config.js`

```diff
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    baseUrl: 'http://localhost:8080/#',
+   specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}' // [1]
  },
});
```

1. This is the default convention, notice that TS is already included, any way in order to support TS in our solution we need TypeScript installed and configured. If we have a look into `node_modules` we will found out the `typescript` package.

> Rename `e2e/cypress.config.js` to `e2e/cypress.config.ts` 

> Update `e2e/cypress.config.ts`

```diff
-const { defineConfig } = require("cypress");
+import { defineConfig } from 'cypress';

-module.exports = defineConfig({
+export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080/#',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  },
});
```

Now that our configuration file is working with TypeScript, lets refactor as well our code.

- Rename the test files
    - e2e/cypress/e2e/first.cy.js -> e2e/cypress/e2e/login.cy.ts
    - e2e/cypress/e2e/hotel-edit-submission.cy.js -> e2e/cypress/e2e/hotel-edit-submission.cy.ts 
    - e2e/cypress/e2e/hotel-viewer-filter.cy.js -> e2e/cypress/e2e/hotel-viewer-filter.cy.ts
    - e2e/cypress/e2e/hotel-viewer-init.cy.js -> e2e/cypress/e2e/hotel-viewer-init.cy.ts
    - e2e/cypress/e2e/hotels-smoke.cy.js -> e2e/cypress/e2e/hotels-smoke.cy.ts
    - e2e/cypress/e2e/login.cy.js -> e2e/cypress/e2e/login.cy.ts

We can check that we have some TS errors in our editor, lets try to solve them.

> Create `e2e/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts"]
}
```

Recall that we were uning a reference to Cypress in our specs to have intellisense, now we can remove them.

> Update `e2e/cypress/e2e/first.cy.ts`

```diff
-/// <reference types="Cypress" />
```

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.ts`

```diff
-/// <reference types="Cypress" />
```

> Update `e2e/cypress/e2e/hotel-viewer-filter.cy.ts`

```diff
-/// <reference types="Cypress" />

describe("Filter panel", () => {
  it("filters hotels by rating", () => {
-   cy.loadAndVisit("hotels-extended.json");
+   (cy as any).loadAndVisit("hotels-extended.json");

    const filters = [
      { value: "all", expectedLength: 4 },
      { value: "bad", expectedLength: 2 },
      { value: "good", expectedLength: 1 },
      { value: "excellent", expectedLength: 1 },
    ];

    cy.wrap(filters).each((filter) => {
-     const { value, expectedLength } = filter;
+     const { value, expectedLength } = filter as any;
      cy.contains(value).click();
      cy.get('[data-testid="hotels"] > li').should(
        "have.length",
        expectedLength
      );
    });
  });
});

```

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.ts`

```diff
-/// <reference types="Cypress" />
-
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
-   cy.loadAndVisit();
+   (cy as any).loadAndVisit();
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
```

> Update `e2e/cypress/e2e/hotels-smoke.cy.ts`

```diff
-/// <reference types="Cypress" />
```

> Update `e2e/cypress/e2e/login.cy.ts`

```diff
-/// <reference types="Cypress" />
```

For last, we are are going to update our custom commands

- Rename
    - e2e/cypress/support/commands.js -> e2e/cypress/support/commands.ts
    - e2e/cypress/support/e2e.js -> e2e/cypress/support/e2e.ts

We can check on `commands.ts` that we have a TS error. To solve this issue, we can create an ambient file.

> Create `e2e/cypress/support/index.d.ts`

```ts
declare namespace Cypress {
  interface Chainable {
    loadAndVisit(data?: string): Chainable<Element>;
  }
}
```

Now we can should update our TypeScript in order to load the new defined types. 

> Update `e2e/tsconfig.json`

```diff
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
-   "types": ["cypress", "node"]
+   "types": ["cypress", "node", "./cypress/support"]
  },
  "include": ["**/*.ts"]
}
```

Recall that we use `(cy as any)` to solve the TS issues, well after this refactor this mus be solved lets remove the 'hack'.

> Update `e2e/cypress/e2e/hotel-viewer-filter.cy.ts`

```diff
describe("Filter panel", () => {
  it("filters hotels by rating", () => {
-   (cy as any).loadAndVisit("hotels-extended.json");
+   cy.loadAndVisit("hotels-extended.json");

```

> Update `e2e/cypress/e2e/hotel-viewer-init.cy.ts`

```diff
describe("Hotel viewer initialization", () => {
  it("displays hotels on page load", () => {
-   (cy as any).loadAndVisit();
+   cy.loadAndVisit();
    cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});

```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

Hummm, seems not to be working, and the reason is because we have prepared everithing like a TS project, but on `root` project there's not a TS definition. Lets solve this.

```bash
npm i typescript -D
```

> Move `e2e/tsconfig.json` to `e2e/cypress/tsconfig.json`

> Update `e2e/cypress/tsconfig.json`

```diff
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
-   "types": ["cypress", "node", "./cypress/support"]
+   "types": ["cypress", "node", "./support"]
  },
  "include": ["**/*.ts"]
}
```

> Create `e2e/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./"
  },
  "include": ["**/*"]
}
```

Now it's working.