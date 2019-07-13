## Introduction

Cypress is a tool that allow us to test our applications on a real browser.

## Install and start up


```bash
npm i cypress -D
```
* Creates a new folder in our root __cypress__, under that folder, creates:
    - __fixtures__
    - __integration__
    - __plugins__
    - __screenshots__
    - __support__
* Adds a new file __cypress.json__
* After inslation we can open __cypress__ by using:

```bash
node_modules\.bin\cypress open
```

* In a windows terminal:

```bash
node_modules/.bin/cypress open
```
* This runs the cypress UI

* We do not want to run this command every time that we launch cypress, so lets modify our __package.json__ for this purpose:

```diff
"scripts": {
    "start": "webpack-dev-server --mode development --inline --hot --open",
    "build": "webpack --mode development",
+   "cypress": "cypress open", 
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

## Now that we have already installed cypress is time to create our first test

* Create __cypress/integration/first.spec.js__

```javascript
describe('Simple test', () => {
    it('Works', () => {
        expect(true).to.equal(true);
    });
});
```

## Great then we have created our first test successfully. But Cypress is bout to get into the real app, so lets make something more interesting. Lets visit a page in our app. 

* Create __cypress/integration/login-input.spec.js__

```javascript
describe('Login input', () => {
    it('visist the login page', () => {
        cy.visit('http://localhost:8080');
    });
});
```

* In order to get results from cypress, we need our application running, in a terminal start our app by:

```bash
npm start
```

* Open a new terminal and run cypress

```bash
npm run cypress
```

We're going to visit this url _http://localhost:8080_ a lot, so we can edit __cypress.json__ to make our lives a little bit easier:

```json
{
    "baseUrl": "http://localhost:8080"
}
```

* And modify out test __cypress/integration/login-input.spec.js__ as follows:

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

* Cypress, in the global object has the __focused function__ we can go on this way as well, but working with __have__ in this case is a better option.