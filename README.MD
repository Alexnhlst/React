# JSX and the Virtual DOM

## Table of contents

1. [Virtual DOM](#virtual-dom)
2. [Virtual DOM Pieces](#virtual-dom-pieces)
3. [JSX](#jsx)

---

## Virtual DOM

React works differently than many earlier front-end JavaScript frameworks in that instead of working with the browser's DOM, it builds a virtual representation of the DOM.
When we do "classic-"style web development, we would typically:

1. locate an element (using `document.querySelector` or `document.getElementById`) and then
2. modify the element directly (say, by calling `.innerHTML()` on the element)

This style of development is problematic in that:

- It's hard to keep track of changes - it can become difficult keep track of current (and prior) state of the DOM to manipulate it into the form we need
- It can be slow - modifying the actual-DOM is a costly operation, and modifying the DOM on every change can cause poor performance

The Virtual DOM was created to deal with these issues. It is a tree of JavaScript objects that represents the actual DOM. When using it we code as if we're recreating the entire DOM on every update. The idea of re-creating the entire DOM results in an easy-to-comprehend development model: instead of the developer keeping track of all DOM state changes, the developer simply returns the DOM they wish to see. React takes care of the transformation behind the scenes.
The Virtual DOM will:

- use efficient diffing algorithms, in order to know what changed
- update subtrees of the DOM simultaneously
- batch updates to the DOM

<details>
    <summary>Virtual DOM vs. Shadow DOM</summary>

> The Shadow DOM is a form of encapsulation on our elements. Think about using the `<video>` tag in a browser. The browser will create a set of video controls such as a play button, a timecode number, a scrubbler progress bar etc. These elements aren't part of the "regular DOM" [^1]

</details>

---

## Virtual DOM Pieces

React's Virtual DOM is a tree of `ReactElements`. A `ReactElement` is a representation of a DOM element in the Virtual DOM. To create a `ReactElment`, we use the `createElement` provided by React:

```javascript
let boldElement = React.createElement("b");
```

Typing the code in the browser console will create an instance a `ReactElement`

```JSON
{
    "$$typeof": "Symbol(react.element)",
    "type": "b",
    "key": null,
    "ref": null,
    "props": {},
    "_owner": null,
    "_store": {}
}
```

Our `boldElment` is an instance of a `ReactElement` but it's not visible without giving it to React to render in the actual DOM tree. In order to render this element to the actual DOM tree we need to use `ReactDOM.render()`, it requires two things:

1. The root of our virtual tree
2. the mount location where we want React write to the actual browser DOM

```javascript
let mountElement = document.getElementById("root");
// This syntax is also valid
// let mountElement = document.querySelector("#root");

ReactDOM.render(boldElement, mountElement);
```

The element has been inserted into the document as a child of the `mountElement`. We now have a `b` tag in our DOM, it would be nice if we could add some text in the tag. Because text is in-between the opening and closing `b` tags, adding text is a matter of creating a child of the element.
`React.createElement()` accepts three arguments:

1. The DOM element type
2. The element `props`
3. The children of the element

The `children` of the DOM element must be a `ReactNode` object, which is any of the following:

1. `ReactElement`
2. A string or a number (a `ReactText` object)
3. An array of `ReactNodes`

```javascript
let mountElement = document.querySelector("#root");
let boldElement = React.createElement("b", null, "Text (as a string)");
ReactDOM.render(boldElement, mountElement);
```

React, using it's own virtual representation of the view-tree, can render this tree in multiple types of canvases. It can also be used to render views in other frameworks such as mobile apps. In React Native, this tree is rendered into native mobile views. We can call the `ReactDOM.render()` function multiple times and it will only perform updates (mutations) to the DOM as necessary. The `ReactDOM.render` function accepts a 3rd argument, a callback argument that is executed after the component is rendered/updated.

---

## JSX

[^1]: [Shadow DOM](https://www.webcomponents.org/community/articles/introduction-to-shadow-dom)
