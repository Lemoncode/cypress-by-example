# Using Task

> https://docs.cypress.io/api/commands/task#Return-a-Promise-from-an-asynchronous-task

Ok. If we have a view on what we have built so far we will find out `e2e/cypress/e2e/hotels-smoke.cy.ts`, this test was interesting, because we were doing a 'real' e2e test. However, notice that preparing the environment implies a couple of requests against the backend server.

> Open

```ts
//....
beforeEach(() => {
  cy.request("DELETE", "http://localhost:3000/api/hotels/all");
});
//....
describe("Hotel viewer", () => {
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
  describe("hotel page loads", () => {
    it("renders a list of hotels", () => {
      cy.get('[data-testid="hotels"] > li').should("have.length", 10);
    });
  });
});
```

This is ok, and perfectly fine, but could be scenarios where we need another mechanism, for example, send a message with another protocol, connect to a database and use a command... The chances are as big as application models we have.

Recall that `Cypress` is running on a `Node` process, so `Cypress` is going to offer us a method to use that process and synchonize with our tests: `cy.task`

> We also have `cy.exec`, this command executes a command on the OS.

Lets have a look on `task` and how we can use it.

> Update `e2e/cypress.config.ts`

```ts
export default defineConfig({
  e2e: {
    /*diff*/
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        getData(url: string) {
          console.log(`You feed this ${url}`);

          return null;
        }
      });
    },
    /*diff*/
    baseUrl: "http://localhost:8080/#",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
```

> Create `e2e/cypress/e2e/task-smoke.cy.ts`

```ts
describe("task smoke test", () => {
  it("hotels data from server", () => {
    cy.task('getData', 'http://localhost:3000/api/hotels');
  });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

> Notice that the message prints out on `Cypress` process.

With this on place, lets try to get data directly from backend server, instead of using the directly the 'client'.

> Create `e2e/utils.ts`

```ts
import http from "http";

// TODO: Try to move to a external file
const getError = (statusCode: number, contentType: string): Error | null => {
  let error = null;
  if (statusCode >= 300) {
    error = new Error(`Request failed with status code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Expected application/json but received ${contentType}`);
  }
  return error;
};

// TODO: Try to move to a external file
export const getJSONtoJS = (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (response) => {
        const { statusCode } = response;
        const contentType = response.headers["content-type"];

        const error = getError(statusCode, contentType);
        if (error) {
          response.resume();
          reject(error);
        }

        response.setEncoding("utf8");
        let rawData = "";
        response.on("data", (chunk) => {
          rawData += chunk;
        });
        response.on('end', () => {
          try {
            const data = JSON.parse(rawData);
            resolve(data);
          } catch (error) {
            reject(error);    
          }
        })
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

```

> Update `e2e/cypress.config.ts`

```diff
import { defineConfig } from "cypress";
+import { getJSONtoJS } from './utils';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        getData(url: string) {
          console.log(`You feed this ${url}`);

-         return null;
+         return getJSONtoJS(url);
        }
      });
    },
    baseUrl: "http://localhost:8080/#",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});

```

> Update `e2e/cypress/e2e/task-smoke.cy.ts`

```diff
describe("task smoke test", () => {
  it("hotels data from server", () => {
    cy.task("getData", "http://localhost:3000/api/hotels")
+   .then((data) => {
+     console.log(data);
+   });
  });
});

```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

> If we open the developer tools we will find out that on data, are our hotels.

Lets complete the test.

> Update `e2e/cypress/e2e/task-smoke.cy.ts`

```ts
describe("task smoke test", () => {
  it("hotels data from server", () => {
    cy.task("getData", "http://localhost:3000/api/hotels").then((data) => {
      /*diff*/  
      console.log(data as any[]);
      const hotels = (data as any[]).map((d) => ({
        ...d,
        name: "foo",
      }));

      cy.intercept("GET", "/api/hotels", hotels).as("hotels");
      cy.visit("/hotel-collection");
      cy.wait("@hotels");
      cy.get('[data-testid="hotels"] > li').should("have.length", 10);
      /*diff*/
    });
  });
});

```