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

> CORE CONCEPT: Cypress wraps all DOM queries with robust retry-and-timeout logic that better suits how real web apps work. We trade a minor change in how we find DOM elements for a major stability upgrade to all of our tests. Banishing flake for good!

In Cypress, when you want to interact with a DOM element directly, call `.then()` with a callback function that receives the element as its first argument. When you want to skip the retry-and-timeout functionality entirely and perform traditional synchronous work, use `Cypress.$.`

### Querying by Text Content

Another way to locate things (human way) is to look them up by their content, by what the user would see on the page.

```js
// Find an element in the document containing the text 'New Post'
cy.contains("New Post");

// Find an element within '.main' containing the text 'New Post'
cy.get(".main").contains("New Post");
```

> WARNING: If your app is translated into multiple languages for i18n, make sure you consider the implications of using user-facing text to find DOM elements!

### When Elements Are Missing

As we showed above, Cypress anticipates the asynchronous nature of web applications and doesn't fail immediately the first time an element is not found. Instead, Cypress gives your app a window of time to finish whatever it may be doing!

This is known as a timeout, and most commands can be customized with specific timeout periods (the default timeout is 4 seconds). These Commands will list a timeout option in their API documentation, detailing how to set the number of milliseconds you want to continue to try finding the element.

```js
// Give this element 10 seconds to appear
cy.get(".my-slow-selector", { timeout: 10000 });
```

> CORE CONCEPT: To match the behavior of web applications, Cypress is asynchronous and relies on timeouts to know when to stop waiting on an app to get into the expected state. Timeouts can be configured globally, or on a per-command basis.

- Timeouts and Performance
  - There is a performance tradeoff here: **tests that have longer timeout periods take longer to fail.** Commands always proceed as soon as their expected criteria is met, so working tests will be performed as fast as your application allows. A test that fails due to timeout will consume the entire timeout period, by design. This means that while you may want to increase your timeout period to suit specific parts of your app, you don't want to make it "extra long, just in case".

### Cahins of Commands

It's very important to understand the mechanism Cypress uses to chain commands together. It manages a Promise chain on your behalf, with each command yielding a 'subject' to the next command, until the chain ends or an error is encountered.

```js
cy.get("textarea.post-body").type("This is an excellent post.");
```

We're chaining `.type()` onto `cy.get()`, telling it to type into the subject yielded from the `cy.get()` query, which will be a DOM element.

- `.blur()` - Make a focused DOM element blur.
- `.focus()` - Focus on a DOM element.
- `.clear()` - Clear the value of an input or textarea.
- `.check()` - Check checkbox(es) or radio(s).
- `.uncheck()` - Uncheck checkbox(es).
- `.select()` - Select an <option> within a <select>.
- `.dblclick()` - Double-click a DOM element.
- `.rightclick()` - Right-click a DOM element.

These commands ensure [some guarantees](https://docs.cypress.io/guides/core-concepts/interacting-with-elements) about what the state of the elements should be prior to performing their actions.

For example, when writing a `.click()` command, Cypress ensures that the element is able to be interacted with (like a real user would). It will automatically wait until the element reaches an "actionable" state by:

- Not being hidden
- Not being covered
- Not being disabled
- Not animating

> CORE CONCEPT: Cypress provides a simple but powerful algorithm when interacting with elements.

### Asserting About Elements

Assertions let you do things like ensuring an element is visible or has a particular attribute, CSS class, or state. Assertions are commands that enable you to describe the desired state of your application. Cypress will automatically wait until your elements reach this state, or fail the test if the assertions don't pass.

```js
cy.get(":checkbox").should("be.disabled");

cy.get("form").should("have.class", "form-horizontal");

cy.get("input").should("not.have.value", "US");
```

### Subject Management

A new Cypress chain always starts with `cy.[command]`, where what is yielded by the `command` establishes what other commands can be called next (chained).

```js
cy.clearCookies() // Yields null
  .visit("/fixtures/dom.html"); // Does not care about the previous subject.

cy.get(".main-container") // Yields an array of matching DOM elements
  .contains("Headlines") // Yields the first DOM element containing content
  .click(); // Yields same DOM element from previous command.
```

> CORE CONCEPT: Cypress commands do not return their subjects, they yield them. Remember: Cypress commands are asynchronous and get queued for execution at a later time. During execution, subjects are yielded from one command to the next, and a lot of helpful Cypress code runs between each command to ensure everything is in order.

- WARNING: **Don't continue a chain after acting on the DOM**
  - While it's possible in Cypress to act on the DOM and then continue chaining, this is usually unsafe, and can lead to stale elements. See the [Retry-ability Guide](https://docs.cypress.io/guides/core-concepts/retry-ability) for more details.
  - But the rule of thumb is simple: If you perform an action, like navigating the page, clicking a button or scrolling the viewport, end the chain of commands there and start fresh from cy.

### Using `.then()` to Act on a Subject

Want to jump into the command flow and get your hands on the subject directly? No problem, add a .then() to your command chain. When the previous command resolves, it will call your callback function with the yielded subject as the first argument.

If you wish to continue chaining commands after your .then(), you'll need to specify the subject you want to yield to those commands, which you can achieve with a return value other than null or undefined. Cypress will yield that to the next command for you.

```js
cy
  // Find the el with id 'some-link'
  .get('#some-link')

  .then(($myElement) => {
    // ...massage the subject with some arbitrary code

    // grab its href property
    const href = $myElement.prop('href')

    // strip out the 'hash' character and everything after it
    return href.replace(/(#.*)/, '')
  })
  .then((href) => {
    // href is now the new subject
    // which we can work with now
  })
```

### Using Aliases to Refer to Previous Subjects

Cypress has some added functionality for quickly referring back to past subjects called Aliases.

```js
cy.get('.my-selector')
  .as('myElement') // sets the alias
  .click()

/* many more actions */

cy.get('@myElement') // re-queries the DOM as before
  .click()
```

### Commands Are Asynchronous

It is very important to understand that Cypress commands don't do anything at the moment they are invoked, but rather enqueue themselves to be run later. 

```js
it('hides the thing when it is clicked', () => {
  cy.visit('/my/resource/path') // Nothing happens yet

  cy.get(".hides-when-clicked") // Still nothing happening
    .should("be.visible") // Still absolutely nothing
    .click() // Nope, nothing

  cy.get('.hides-when-clicked') // Still nothing happening
    .should('not.be.visible') // Definitely nothing happening yet
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

Cypress doesn't kick off the browser automation until the test function exits.

### Mixing Async and Sync code

Remembering that Cypress commands run asynchronously is important if you are attempting to mix Cypress commands with synchronous code. Synchronous code will execute immediately - not waiting for the Cypress commands above it to execute.

#### Incorrect Usage

```js
it('does not work as we expect', () => {
  cy.visit('/my/resource/path') // Nothing happens yet

  cy.get('.awesome-selector') // Still nothing happening
    .click() // Nope, nothing

  // Cypress.$ is synchronous, so evaluates immediately
  // there is no element to find yet because
  // the cy.visit() was only queued to visit
  // and did not actually visit the application
  let el = Cypress.$('.new-el') // evaluates immediately as []

  if (el.length) {
    // evaluates immediately as 0
    cy.get('.another-selector')
  } else {
    // this will always run
    // because the 'el.length' is 0
    // when the code executes
    cy.get('.optional-selector')
  }
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

#### Correct Usage

```js
it('does not work as we expect', () => {
  cy.visit('/my/resource/path') // Nothing happens yet

  cy.get('.awesome-selector') // Still nothing happening
    .click() // Nope, nothing
    .then(() => {
      // placing this code inside the .then() ensures
      // it runs after the cypress commands 'execute'
      let el = Cypress.$('.new-el') // evaluates after .then()

      if (el.length) {
        cy.get('.another-selector')
      } else {
        cy.get('.optional-selector')
      }
    })
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

#### CORE CONCEPT 

Each Cypress command (and chain of commands) returns immediately, having only been appended to a queue to be executed at a later time.

You purposefully cannot do anything useful with the return value from a command. Commands are enqueued and managed entirely behind the scenes.

We've designed our API this way because the DOM is a highly mutable object that constantly goes stale. For Cypress to prevent flake, and know when to proceed, we manage commands in a highly controlled deterministic way.

### Commands Run Serially

After a test function is finished running, Cypress goes to work executing the commands that were enqueued using the `cy.*` command chains

```js
it('hides the thing when it is clicked', () => {
  cy.visit('/my/resource/path') // 1.

  cy.get('.hides-when-clicked') // 2
    .should('be.visible') // 3
    .click() // 4

  cy.get('.hides-when-clicked') // 5
    .should('not.be.visible') // 6
});
```

1. Visit the URL (or mount the component).
2. Find an element by its selector.
3. Assert that the element is visible.
4. Perform a click action on that element.
5. Find an element by its selector.
6. Assert that the element is no longer visible.

These actions will always happen serially (one after the other), never in parallel (at the same time). Why?

1. Visit the URL ✨ and wait for the page load event to fire after all external resources have loaded ✨ (or mount the component ✨ and wait for the component to finish mounting ✨)
2. Find an element by its selector ✨ and retry until it is found in the DOM ✨
3. Assert that the element is visible ✨ and retry until the assertion passes ✨
4. Perform a click action on that element ✨ after we wait for the element to reach an actionable state ✨
5. Find an element by its selector ✨ and retry until it is found in the DOM ✨
6. Assert that the element is no longer visible ✨ and retry until the assertion passes ✨

As you can see, Cypress does a lot of extra work to ensure the state of the application matches what our commands expect about it. Each command may resolve quickly (so fast you won't see them in a pending state) but others may take seconds, or even dozens of seconds to resolve.

> CORE CONCEPT: Any waiting or retrying that is necessary to ensure a step was successful must complete before the next step begins. If they don't complete successfully before the timeout is reached, the test will fail.

### The Cypress Command Queue

While the API may look similar to Promises, with it's then() syntax, Cypress commands and queries are not promises - they are serial commands passed into a central queue, to be executed asynchronously at a later date. These commands are designed to deliver deterministic, repeatable and consistent tests.

Almost all commands come with built-in [retry-ability](https://docs.cypress.io/guides/core-concepts/retry-ability). Without [retry-ability](https://docs.cypress.io/guides/core-concepts/retry-ability), assertions would randomly fail. This would lead to flaky, inconsistent results.

Commands also have some design choices that developers who are used to promise-based testing may find unexpected. They are intentional decisions on Cypress' part, not technical limitations.

1. You cannot **race** or run multiple commands at the same time (in parallel).
2. You cannot add a `.catch` error handler to a failed command.

The whole purpose of Cypress (and what makes it very different from other testing tools) is to create consistent, non-flaky tests that perform identically from one run to the next. Making this happen isn't free - there are some trade-offs we make that may initially seem unfamiliar to developers accustomed to working with Promises or other libraries.

### Trade Offs

#### You cannot race or run multiple commands at the same time

Cypress guarantees that it will execute all of its commands and queries deterministically and identically every time they are run.

- `cy.request()` automatically gets + sets cookies to and from the remote server.
- `cy.clearCookies()` clears all of the browser cookies.
- `.click()` causes your application to react to click events.

None of the above commands are idempotent; they all cause side effects. Racing commands is not possible because commands must be run in a controlled, serial manner in order to create consistency. Because integration and e2e tests primarily mimic the actions of a real user, Cypress models its command execution model after a real user working step by step.

#### You cannot add a `.catch` error handler to a failed command

In Cypress there is no built in error recovery from a failed command. A command and its assertions all eventually pass, or if one fails, all remaining commands[label](https://docs.cypress.io/guides/core-concepts/interacting-with-elements) are not executed, and the test fails.

### Assertions

### Timeouts

#### Applying Timeouts

