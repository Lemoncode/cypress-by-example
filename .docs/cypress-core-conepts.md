# Core Concepts

## Introduction to Cypress

`Cypress` is design to be simple.

### Querying Elements

> Cypress is like jQuery

```js
$(".my-selector");
```

```js
cy.get(".my-selector");
```

> Cypress bundles `jQuery`

```js
// Each Cypress query is equivalent to its jQuery counterpart.
cy.get("#main-content")
  .find(".article")
  .children('img[src^="/static"]')
  .first();
```

> CORE CONCEPT: Cypress leverages jQuery's powerful selector engine to help make tests familiar and readable for modern web developers.

> WARNING: Cypress does not return the element synchronously.

```js
// This is fine, jQuery returns the element synchronously.
const $jqElement = $(".element");

// This will not work! Cypress does not return the element synchronously.
const $cyElement = cy.get(".element");
```

> Cypress is like jQuery, but....

When jQuery can't find an element it returns an empty collection. `Cypress` automatically retries the query until either:

1. The element is found

```js
cy
  // cy.get() looks for '#element', repeating the query until...
  .get("#element")

  // ...it finds the element!
  // You can now work with it by using .then
  .then(($myElement) => {
    doSomething($myElement);
  });
```

2. A set timeout is reached

```js
cy
  // cy.get() looks for '#element-does-not-exist', repeating the query until...
  // ...it doesn't find the element before its timeout.
  // Cypress halts and fails the test.
  .get("#element-does-not-exist")

  // ...this code is never run...
  .then(($myElement) => {
    doSomething($myElement);
  });
```

This makes Cypress robust and immune to dozens of common problems that occur in other testing tools. Consider all the circumstances that could cause querying a DOM element to fail:

- The DOM has not loaded yet.
- Your framework hasn't finished bootstrapping.
- An XHR request hasn't responded.
- An animation hasn't completed
