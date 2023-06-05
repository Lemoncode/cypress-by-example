/// <reference types="Cypress" />

import React from "react";
import ColorGenerator from "./ColorGenerator";

describe("<ColorGenerator />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ColorGenerator />);
    cy.get('[data-cy-root=""] > div').should(
      "have.css",
      "background-color",
      "rgb(255, 0, 0)"
    );
  });

  it("changes to gray when the gray button is pressed", () => {
    cy.mount(<ColorGenerator />);
    cy.get("[data-cy=gray]").click();
    cy.get('[data-cy-root=""] > div').should(
      "have.css",
      "background-color",
      "rgb(85, 85, 85)"
    );
  });
});
