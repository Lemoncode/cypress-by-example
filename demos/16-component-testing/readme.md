# Component Testing

This is a feature that was introduced on version 10. And is just and simply testing for our components.

> NOTE: Use Node 18

```bash
npm create vite@latest simple-app -- --template react
```

As output we get:

```
Done. Now run:

  cd simple-app
  npm install
  npm run dev
```

```bash
cd simple-app && npm install
```

Nice with this on place, we can go ahead and install `Cypress`.

```bash
npm i cypress -D
```

And open `Cypress` to finish the configuration.

```bash
npx cypress open
```

> Select `Component Testing` and just use the installation wizard.

Now we need a component to be tested. So lets create one.

> Create `simple-app/src/components/ColorGenerator.jsx`

We have used the following links to get the color function:

- https://medium.com/swlh/javascript-color-functions-c91efabdc155
- https://www.slingacademy.com/article/javascript-convert-a-byte-array-to-a-hex-string-and-vice-versa/?utm_content=cmp-true

```jsx
import { useState } from "react";

const hexToBytes = (hex) => {
  var bytes = [];

  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
};

export default function ColorGenerator({
  initialColor = "ff0000",
  onChange = () => {},
}) {
  const [color, setColor] = useState(initialColor);

  const handleConvertToGray = () => {
    const [r, g, b] = hexToBytes(color);
    const gray = ((r + g + b) / 3) >> 0;
    const grayColor = `${gray.toString(16)}${gray.toString(16)}${gray.toString(
      16
    )}`;
    setColor(grayColor);
  };

  const handleBackToColor = () => {
    setColor(initialColor);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: `#${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        style={{ width: "12rem", marginBottom: "1rem" }}
        data-cy="gray"
        onClick={handleConvertToGray}
      >
        Convert to Gray
      </button>
      <button
        style={{ width: "12rem" }}
        data-cy="color"
        onClick={handleBackToColor}
      >
        Back to color
      </button>
    </div>
  );
}
```

Now that we have a Component to test we're going to use the `Cypress App`.

```bash
npx cypress open
```

> "Create your first spec" screen, click "Create from component".

A modal will pop up listing all the component files that are found in your app (Cypress will exclude **\*.config.{js,ts}** and **\*.{cy,spec}.{js,ts,jsx,tsx}** files from this list). Expand the row for **ColorGenerator.jsx** and select the **ColorGenerator** component.

A spec file was created at `simple-app/src/components/ColorGenerator.cy.jsx`

```jsx
import React from "react";
import ColorGenerator from "./ColorGenerator";

describe("<ColorGenerator />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ColorGenerator />);
  });
});
```

The test executes one command: `cy.mount(<ColorGenerator />)`. The `cy.mount()` method will mount our component into the test app so we can begin running tests against it.

> Run the test from App

Our first test verifies the component can mount in it's default state without any errors. If there is a runtime error during test execution, the test will fail, and you will see a stack trace pointing to the source of the problem.

A basic test like the one above is an excellent way to start testing a component. Cypress renders your component in a real browser, and you can use all the techniques/tools you would normally during development, such as interacting with the component in the test runner, and using the browser dev tools to inspect and debug both your tests and the component's code.

### Selectors & Assertions

```js
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
});
```

### Testing Interactions

```js
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
  /*diff*/
  it("changes to gray when the gray button is pressed", () => {
    cy.mount(<ColorGenerator />);
    cy.get("[data-cy=gray]").click();
    cy.get('[data-cy-root=""] > div').should(
      "have.css",
      "background-color",
      "rgb(85, 85, 85)"
    );
  });
  /*diff*/
});
```

```bash
npx cypress open
```