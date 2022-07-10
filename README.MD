# Basics :construction:

## Table of contents

1. [What's the point of React?](#whats-the-point-of-react)
2. [Object Elements](#object-elements)
3. [A Complex Element](#a-complex-element)
4. [Element Factory](#element-factory)

---

## What's the point of React?

When we're using React, the problem we're trying to solve is how to update our "HTML" view with **dynamic data** and **user interactions**.
**React manages the view layer of your application.**
That is, you take your **data** and you pass it to **React** and the output is your "HTML" view.
At a high level, you can roughly think of what React does as the equation:

```javascript
reactApp(yourData) => rendered view
```

jQuery's approach is basically to manipulate the DOM directly. jQuery gives you, as its name implies, query methods that allow to get access to DOM elements.
Once you have a reference to a DOM elements you imperatively write text into your DOM nodes, add event listeners and so on. The problem with is that this gets unwieldy fast.
It starts small: you add a few elements to a list, change a `<p>` here and there, but as the application grows and requirements change you end up with hundreds of elements that all need to be updated dynamically.
If you're not careful the performance of your app can suffer. You're forced to craft some sophisticated algorithms that don't thrash the DOM and bring the browser to its knees.
Furthermore, it's just hard to keep track of the resulting nest of code -- it can be difficult to orchestrate those handlers to all work together.

React tries to solve this problem for you and it does it with **the help of a *virtual* DOM** (VDOM), which is just a fancy name for **plain old JavaScript objects** nested to resemble the structure of a DOM. 

---

## Object Elements

```javascript
 // A simple element
      let anotherElement = {
        $$typeof: magicValue,
        ref: null,
        type: "p",
        props: {
          children: "A nice text paragraph",
        },
      };
```

For this object, the first part `$$typeof` is used bt *React* to differentiate between simple objects and React elements.
`Symbol` si a relatively new object in JavaScript and not all browsers support it. If you use a browser with a JavaScript version that doesn't support symbols, the mugic number `0xeac7` is used.

> The idea of **symbols** is that they are globally unique. If someone wants to access an attribute that use a symbol as an object key or tries to check if something equals a specific symbol, they have to explicitly get that symbol with `Symbol.for()` function.

>The term **magic nubmer** can have different meaning in programming. In this case, it means a constant numerical or text value used to identify a file format or protocol. This magic number is arbitrary. It's just a number selected by the React team as an identifier to be used for all React element objects.

React creates one of these symbols and then checks if objects contain it inside ther `$$typeof` attribute. The second part of `anotherElement` is the `ref`. It can be used to store a reference to the corresponding DOM element after this React element is rendered into the DOM. The `type` tells React what kind of DOm element it should create for this object. `props` is React's way to *pass data down the element tree*

---

## A Complex Element

```javascript
 let reactElement = {
        // This special property will be checked by React to ensure this object
        // is a React element and not just some user data
        // React.createElement() sets it for you
        $$typeof: magicValue,

        // This will also be checked by React. If references are not used, this
        // has to be set to null and not undefined
        ref: null,

        // This defines the HTML-tag
        type: "h1",

        // This defines the properties that get passed down to the element
        props: {
          // In this example there is just a single text node as child
          children: "Hello, world!",

          // a CSS class
          className: "abc",

          // styles can be passed as object literals
          // React uses camelCase instead of dashed-case (like CSS/D3 do)
          style: {
            textAlign: "center",
          },

          // event handlers can be added as properties
          // React uses synthetic events to try to normalize browser behavior
          onClick: function (notYourRegularEvent) {
            alert("click");
          },
        },
      };
```

`className` is the React way to add a CSS `class` attribute to an element, it makes it easy to style your React elements.

> The `className` is a DOM element property used to set the value of class attribute of that element. React avoided using `class` because it is a reserved word in JavaScript

`srtyle` in HTML is normally a string attribute, but for React it has to be an object. It uses `camelCase` instead of `kebab-case` what you would expect from CSS. `onClick` is the way to add *event handlers* to objects. They are written in `camelCase` instead of `lowercase` and you can pass functions directly without the need to wrap them in a string. Another difference to these handlers is that they het a `SyntheticEvent` as an argument, rather than a browser's native event. This is done to *normalize events across all browsers* so that events always look the same to our code.

>`SyntheticEvent`s also have a `nativeEvent` attribute you can use if you need the real event for some reason. They also are re-used when your function returns, so gather all the data you need from them before you make any asynchronous calls.

---

## Element Factory