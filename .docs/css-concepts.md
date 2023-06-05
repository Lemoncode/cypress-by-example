# CSS

## Common Selectors

- `head` - Simple element selector, selects the element with the `head` tag
- `.red` - selects all elements with the 'red' class
- `#nav` - selects all elements with the 'nav' Id
- `div.row` - selects all elements with the `div` tag **&** the 'row' class
- `[aria-hidden="true"]` - selects all elements with the `aria-hidden` attribute with a value of "true"

## Combine Selectors

- `li a` - DOM descendants combinator. All `a` tags that are a child of `li` tags
- `div.row *` selects all elements that are descendent (or child) of the elements with `div` tag and 'row' class
- `li > a` Difference combinator. Select direct descendants, instead of all descendants like the descendant selectors
- `li + a` The adjacent sibling combinator (+) separates two selectors and matches the second element only if it immediately follows the first element, and both are children of the same parent element.
- `li, a` Selects all `a` elements and all `li` elements.
- `li ~ a` The sibling combinator. Selects `a` element following a `li` element.

## Pseudo-selectors or pseudo structural classes

- `:first-child` Target the first element immediately inside (or child of) another element
- `:last-child` Target the last element immediately inside (or child of) another element
- `:nth-child()` Target the nth element immediately inside (or child of) another element. Admits integers, `even`, `odd`, or formulas
- `a:not(.name)` Selects all a elements that are not of the .name class
- `::after` Allows inserting content onto a page from CSS, instead of HTML. While the end result is not actually in the DOM, it appears on the page as if it is. This content loads after HTML elements.
- `::before` Allows inserting content onto a page from CSS, instead of HTML. While the end result is not actually in the DOM, it appears on the page as if it is. This content loads before HTML elements.

We can use pseudo-classes to define a special state of an element of the DOM. But they don’t point to an element by themselves.

- `:hover` selects an element that is being hovered by a mouse pointer
- `:focus` selects an element receiving focus from the keyboard or programattially
- `:active` selects an element being clicked by a mouse pointer
- `:link` selects all links that have not been clicked yet
- `:visited` selects a link that has already been clicked

## Demo: `+`, `>` and `~`

> Create `index.html`

```html
<div id="container">
  <p>First</p>
  <div>
    <p>Child Paragraph</p>
  </div>
  <p>Second</p>
  <p>Third</p>
</div>
```

> Create `styles.css`

```css
div#container p{
  background-color:green;
}
```

### > Sign:

It is a child selector, which selects **DIRECT** child elements of a specified parent element.

> Update `styles.css`

```diff
-div#container p{
+div#container > p{
  background-color:green;
}
```

### + Sign:

It is **Adjacent sibling** combinator. It combines two sequences of simple selectors having the same parent and the second one must come **IMMEDIATELY** after the first.

> Update `styles.css`

```diff
-div#container > p{
+div + p{
  background-color:green;
}
```

### ~ Sign:

It is **general sibling** combinator and similar to Adjacent sibling combinator. The difference is that the second selector does **NOT** have to immediately follow the first one means It will select all elements that is preceded by the former selector.

> Update `styles.css`

```diff
-div + p{
+div ~ p{
  background-color:green;
}
```


