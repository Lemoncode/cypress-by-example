## Introduction

Cypress is a tool that allow us to test our applications on a real browser.

## Install and start up

Let's create a segregate project that will host the cypress solution independently.

```bash
mkdir e2e
cd e2e
npm init -y
```

Once this new project it's initialised we can install the cypress dependencies

```bash
npm i cypress -D
```

## Configuration

Once `Cypress` is installed we can run commands against it.

```bash
npx cypress open
```

This command will open the `Cypress project`. Notice that there's not such project, in this case if we open a not exitsing project, we will be prompted with a configuration wizard to set up the project. In order to do this, lets update the `package.json` file:

> Update `./e2e/package.json`

```diff
....
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
+   "test:e2e": "cypress open"
},
....
```

And now we can simply run it from `e2e directory`.

```bash
npm run test:e2e
```

- This will prompt a wizard, **select** `e2e testing`.
- `Cypress` warns us with the new files that will be created:
  - `cypress.config.js`
  - `cypress/support/e2e.js`
  - `cypress/support/commands.js`
  - `cypress/fixtures/example.json`
- **Click** on `Continue`
- `Cypress` asks now about the environment, `Chrome` or `Electron`
  - **Select** `Chrome`
  - **Click** on `Start E2E testing on Chrome`

A new window now is open on a `Chrome` instance managed by `Cypress` process, we can create a complete example guide from here and have and overview on how we can work with `Cypress`. 

**Remove** `e2e directory contents`, and lets create our first test.

> Create ``

## Now that we have already installed cypress is time to create our first test

- Create **cypress/integration/first.spec.js**

```javascript
/// <reference types="Cypress" />

describe("Simple test", () => {
  it("Works", () => {
    expect(true).to.equal(true);
  });
});
```

- The first line is to ahieve Cypress intellisense. Let's run this test from cypress window and check out that everything is ok.

## Great then we have created our first test successfully. But Cypress is bout to get into the real app, so lets make something more interesting. Let's visit a page in our app.

- Create **cypress/integration/login-input.spec.js**

```javascript
/// <reference types="Cypress" />

describe("Login input", () => {
  it("visist the login page", () => {
    cy.visit("http://localhost:8080");
  });
});
```

- In order to get results from cypress, we need our application running, in a terminal start our app by:

```bash
npm start:dev
```

- Open a new terminal and run cypress

```bash
npm run cypress
```

We're going to visit this url _http://localhost:8080_ a lot, so we can edit **./cypress.json** to make our lives a little bit easier:

```json
{
  "baseUrl": "http://localhost:8080"
}
```

- And modify out test **cypress/integration/login-input.spec.js** as follows:

```diff
describe('Login input', () => {
    it('visist the login page', () => {
-       cy.visit('http://localhost:8080');
+       cy.visit('/');
    });
});
```

## We can notice that when user comes to login the focus is set on login name. We are going to define a test that finds the focused element. We're on a login form, where input element that we're looking for is an input of type text, so we can write our test as follows:

```diff
describe('Login input', () => {
    it('visist the login page', () => {
        cy.visit('/');
    });

+   it('focuses the input name on load', () => {
+       cy.visit('/');
+       cy.get("[type='text']")
+           .should('have.focus');
+   });
});
```

- Cypress, in the global object has the **focused function** we can go on this way as well, but working with **have** in this case is a better option.
