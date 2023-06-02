// const { defineConfig } = require("cypress");
import { defineConfig } from 'cypress';

// module.exports = defineConfig({
export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    baseUrl: 'http://localhost:8080/#',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  },
});
