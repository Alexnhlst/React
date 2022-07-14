# JSX and the Virtual DOM

## Table of contents

1. [Virtual DOM](#virtual-dom)
2. [Virtual DOM Pieces](#virtual-dom-pieces)

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

---

## Virtual DOM Pieces
