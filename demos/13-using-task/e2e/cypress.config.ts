import { defineConfig } from "cypress";
import { getJSONtoJS } from './utils';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        getData(url: string) {
          console.log(`You feed this ${url}`);

          // return null;
          return getJSONtoJS(url);
        }
      });
    },
    baseUrl: "http://localhost:8080/#",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
