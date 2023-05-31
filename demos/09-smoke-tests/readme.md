# Smoke Tests

In this demo we're going to create a smoke tests. But waht is a smoke test? Basically is a test that verifies that the most important parts of our application works.

Lets do some of these tests. The entry point in our application will be the login form, so lets create a smoke test for this feature.

> Update `e2e/cypress/e2e/login.cy.js`

```javascript
describe("Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("focuses the input name on load", () => {
    cy.get("[type='text']").should("have.focus");
  });

  it("name accepts input", () => {
    const typedText = "admin";
    cy.get("#name").type(typedText).should("have.value", typedText);
  });
  /*diff*/
  describe("smoke test", () => {
    context("user uses valid credentials", () => {
      it("navigates to hotel summary page", () => {
        cy.get(`[type='text']`).type("admin");
        cy.get(`[type='password']`).type("test");
        cy.get(`[type='submit']`).click();

        cy.url().should("include", "/hotel-collection");
      });
    });
  });
  /*diff*/
});
```

Note here that we're using `context` allows us to segment our use cases on different contexts. Here we're working on a context that user use valid credentials. The expectation is that navigates to hotels page, so here we're checking that the url contains the expected fragment.

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

> EXERCISE: Create additional context where user does NOT provide valid credentials. Before create the test, it would be nice, to have a look on current application behaviour.

> SOLUTION: Update `e2e/cypress/e2e/login.cy.js`

```javascript
// ....
describe("smoke test", () => {
  context("user uses valid credentials", () => {
    it("navigates to hotel summary page", () => {
      cy.get(`[type='text']`).type("admin");
      cy.get(`[type='password']`).type("test");
      cy.get(`[type='submit']`).click();

      cy.url().should("include", "/hotel-collection");
    });
  });
  
  /*diff*/
  context("user uses invalid credentials", () => {
    it("shows an alert", () => {
      cy.get(`[type='text']`).type("admini");
      cy.get(`[type='password']`).type("teeeest");
      cy.get(`[type='submit']`).click();

      cy.on("window:alert", cy.stub().as("alertStub"));
      cy.get("@alertStub").should(
        "not.have.been.calledWith",
        "invalid credentials"
      );
    });
  });
  /*diff*/
});
// ...
```

Lets move to a different context, another real important feature is to check that we have added a new hotel in our app. The challange here is to have a predictable state (in our database) to make our tests repeatable.

To achieve this goal we need that our database starts completly clean, that means no hotels.Delete entries in `backend/db.json`, the file has to look this way:

> Update `backend/db.json`

```json
{
  "hotels": []
}
```

Now we can create a new fixture `e2e/cypress/fixtures/hotels-server.json` that will host our hotels.

```bash
# From root solution directory
cp hotels.json e2e/cypress/fixtures/hotels-server.json
```

Now we can create new smoke test related with hotels. Lets create the test declaration that we want for this hotels smoke tests.

> EXERCISE: Create smoke tests, with the following use cases: The user fullfils new hotel form with valid fields. And the default hotel collection page renders hotels.

> Create `e2e/cypress/e2e/hotels-smoke.cy.js`

```javascript
/// <reference types="Cypress" />

describe("Hotels smoke tests", () => {
  describe("Hotel form", () => {
    context("user fullfils form valid fields", () => {
      describe("user clicks on save", () => {
        it("adds a new hotel", () => {});
      });
    });
  });

  describe("Hotel viewer", () => {
    describe("hotel page loads", () => {
      it("renders a list of hotels", () => {});
    });
  });
});

```

We can notice that the **second test will depend on the first one** unless we do something. But also the first one implemented alone is not repeatable, lets demonstrate this:

```javascript
describe("Hotels smoke tests", () => {
  describe("Hotel form", () => {
    /*diff*/
    const newHotel = {
      id: "Test id",
      picture: "Test picyture",
      name: "Test hotel",
      description: "This is a foo description",
      city: "Seattle",
      address: "Foo address",
      rating: 4,
    };
    /*diff*/

    context("user fullfils form valid fields", () => {
      describe("user clicks on save", () => {
        it("adds a new hotel", () => {
          /*diff*/
          // Arrange
          cy.intercept("POST", "/api/hotels").as("create");
          cy.intercept("GET", "/api/cities").as("load");

          cy.visit("/hotel-edit/0");
          cy.wait("@load");

          // Act
          cy.get("#name").type(newHotel.name);
          cy.get("#address").type(newHotel.address);
          cy.get("#description").type(newHotel.description);

          cy.get("#city").click();
          cy.get('[data-value="Seattle"]').click();
          cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();

          // Assert
          cy.get('[data-testid="hotels"] > li').should("have.length", 1);
          /*diff*/
        });
      });
    });
  });

  describe("Hotel viewer", () => {
    describe("hotel page loads", () => {
      it("renders a list of hotels", () => {});
    });
  });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

We can check that if we run again the test the number of items is different making this test not repeatable. So, if we **run twice the same test** we can check that the **test is broken**. Lets fix this.

> Update `e2e/cypress/e2e/hotels-smoke.cy.js`

```diff
describe("Hotels smoke tests", () => {
  describe("Hotel form", () => {
    const newHotel = {
      id: "Test id",
      picture: "Test picyture",
      name: "Test hotel",
      description: "This is a foo description",
      city: "Seattle",
      address: "Foo address",
      rating: 4,
    };

+   beforeEach(() => {
+     cy.request("DELETE", "http://localhost:3000/api/hotels/all");
+   });
....
```

- Now our test is completly repeatable. But what about if we want to check a list of items in our test. Lets get it this done.

```javascript
/// <reference types="Cypress" />

describe("Hotels smoke tests", () => {
  describe("Hotel form", () => {
    const newHotel = {
      id: "Test id",
      picture: "Test picyture",
      name: "Test hotel",
      description: "This is a foo description",
      city: "Seattle",
      address: "Foo address",
      rating: 4,
    };

    beforeEach(() => {
      cy.request("DELETE", "http://localhost:3000/api/hotels/all");
    });

    context("user fullfils form valid fields", () => {
      describe("user clicks on save", () => {
        it("adds a new hotel", () => {
          // Arrange
          cy.intercept("POST", "/api/hotels").as("create");
          cy.intercept("GET", "/api/cities").as("load");

          cy.visit("/hotel-edit/0");
          cy.wait("@load");

          // Act
          cy.get("#name").type(newHotel.name);
          cy.get("#address").type(newHotel.address);
          cy.get("#description").type(newHotel.description);

          cy.get("#city").click();
          cy.get('[data-value="Seattle"]').click();
          cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();

          // Assert
          cy.get('[data-testid="hotels"] > li').should("have.length", 1);
        });
      });
    });
  });

  describe("Hotel viewer", () => {
    /*diff*/
    beforeEach(() => {
      cy.fixture("hotels-server").then((hotels) => {
        cy.request("POST", "http://localhost:3000/api/hotels/bulkload", {
          hotels,
        });
        cy.intercept("GET", "/api/hotels").as("load");
        cy.visit("/hotel-collection");
        cy.wait("@load");
      });
    });
    /*diff*/
    describe("hotel page loads", () => {
      it("renders a list of hotels", () => {
        /*diff*/
        cy.get('[data-testid="hotels"] > li').should("have.length", 10);
        /*diff*/
      });
    });
  });
});

```
