## Let's intoduce a simple selector example. We're going to write a test to verify that our input accept text, lets start by typing a new test.

```javascript
describe("Login input", () => {
  it("visist the login page", () => {
    cy.visit("/");
  });

  it("focuses the input name on load", () => {
    cy.visit("/");
    cy.get("[type='text']").should("have.focus");
  });

  it.only("name accepts input", () => {
    // [1]
    cy.visit("/");
  });
});
```

1. Notice that we are using **only**, so in this test case, this is the only assertion that will run.

- Now if we run cypress, only one test is running, if we click on the bullseye, we can select any element in our page.

- Copy to clipboard, and now we can refactor our test as follows:

```diff
it.only('name accepts input', () => {
    cy.visit('/');
+   cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
+       .type('admin');
});
```

- If we run our test again we will find that the text is typed into the desire input.
- Now we can add a verify statement for this test.

```diff
it.only('name accepts input', () => {
    cy.visit('/');
    cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
        .type('admin')
+       .should('have.value', 'admin');
});
```

- Let's make a little refactor into our code.

```javascript
it.only("name accepts input", () => {
  cy.visit("/");
  const typedText = "admin";
  cy.get(":nth-child(1) > .MuiInputBase-root > .MuiInputBase-input")
    .type(typedText)
    .should("have.value", typedText);
});
```

## If we look at our code we can notice that in all our tests we are visiting the home page. Because cypress is running mocha under the hood, we can take advantage of this. Lets refactor our code as follows:

```diff
describe('Login input', () => {
+   beforeEach(() => {
+       cy.visit('/');
+   });

-   it('visist the login page', () => {
-       cy.visit('/');
-   });

    it('focuses the input name on load', () => {
-       cy.visit('/');
        cy.get("[type='text']")
            .should('have.focus');
    });

-   it.only('name accepts input', () => {
+   it('name accepts input', () => {
-       cy.visit('/');
        const typedText = 'admin';
        cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputBase-input')
            .type(typedText)
            .should('have.value', typedText);
    });
});
```
