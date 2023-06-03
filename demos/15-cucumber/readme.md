# Cucumber

For this demo we are going to create a new project for `Cypress`. This will make easier understand what is going on with configuration.

> Use Node version 18.x

```bash
mkdir e2e-cucumber
cd e2e-cucumber && npm init -y
```

In order to use `Cucumber` with `Cypress`, we need to pre process the test files. There are different recipies to achieve that in our case, we're going to use `Webpack` + `TypeScript`

```bash
npm i @badeball/cypress-cucumber-preprocessor \
    @cypress/webpack-preprocessor \
    cypress \
    ts-loader \
    typescript \
    webpack
```


> Create `e2e-cucumber/tsconfig.json`

```json
{}
```

> Update `e2e-cucumber/package.json`

```json
{
  // ....
  "scripts": {
    "cypress:open": "cypress open",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ....
}
```

Now we are going to let `Cypress` create the files for us.

```bash
npm run cypress:open
```

> Follow the instractions to create the TS boilerplate

Ok, with this on place, lest us the Cucumber plugin.

> Update `e2e-cucumber/cypress.config.ts`

```diff
export default defineConfig({
  e2e: {
-   setupNodeEvents(on, config) {
-     // implement node event listeners here
-   },
  },
});
```

```ts
import { defineConfig } from "cypress";
/*diff*/
import * as webpack from "@cypress/webpack-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  return config;
}

/*diff*/
```

```diff
export default defineConfig({
  e2e: {
+   specPattern: '**/*.feature',
+   setupNodeEvents
  },
});
```

Nice, lets see if it works.

> Create `e2e-cucumber/cypress/e2e/duckduckgo.feature`

```
Feature: duckduckgo.com
  Scenario: visiting the frontpage
    When I visit duckduckgo.com
    Then I should see a search bar
```

> Create `e2e-cucumber/cypress/e2e/duckduckgo.ts`

```ts
import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit duckduckgo.com", () => {
  cy.visit("https://duckduckgo.com");
});

Then("I should see a search bar", () => {
  cy.get("#searchbox_input").should(
    "have.attr",
    "placeholder",
    "Search the web without being tracked"
  );
});

```

Lets test that it works

```bash
npm run cypress:open
```

> EXERCISE: Test the login functionality of `Hotel Viewer App` using `Cucumber`