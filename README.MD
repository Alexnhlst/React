# Components:package:

## Table of contents

1. [Functional Components](#functional-components)

---

## Functional Components

Components allow encapsulating **elements** and **behavior** for *reuse* in our application.
The most basic version is a **functional component**. They are simply a function with `UpperCase` name.

> Functional components are sometimes also called **stateless components** becausse they can't have their own state.

```javascript
let data = "world";
      let reactElement = (
        <div>
          <h1>Hello</h1>
          <h2>{data}</h2>
        </div>
      );
```

We could now use `reactElement` somewhere to render the example, but the `data` it uses isn't encapsulated **and** if we wanted to use `reactElement` within the JSX of another element, we would have to wrap the variable `reactElement` in curly braces.
One improvement we could make would be to rewrite the example with a simple function:

```javascript
function myElement() {
        let data = "world";
        return (
          <div>
            <h1>Hello</h1>
            <h2>{data}</h2>
          </div>
        );
      }
```

If we use un `UpperCase` first letter, JSX won't pass a string as the first `type` argument to the `React.createElement()` function but **a reference**. This lets us compose components.
When using the lowercase tag `<text>`:
`<text>X</text>` becomes `React.createElement("text", null, "X")`
but when usint the uppercase tag `<Text>`:
`<Text>X</Text>` becomes `React.createElement(Text, null, "X")`
A variable named `Text` is used as the first argument, and it can be a component (or function) that wraps complex behavior.

>In React, as a loose rule-of-thumb, we'll keep each component in it's own file. Then, when we need to use the component we'll `import` it.

An UpperCase tag like `<Text>...</Text>` is passed as a variable name into the React.createElement() function, there are two requirements this first/type argument (Text, in this case) must satisfy:

    1. There must be a variable in scope with that exact name
    2. The variable must be a function that returns an element, an array of elements or null

If our component returns more than one element (and we don't want to wrap it into an extra `<div>` element), we can return the elements in an array.

```javascript
function MyComponent() {
        let data = "world";
        return [<h1 key="hello">Hello</h1>, <h2 key="data">{data}</h2>];
      }
```

> The `key` prop is used by React to **determine the position of multiple elements in one array**. If we update one of these elements and keep the `key` the same, React doesn't need to replace every element from the array in the virtual DOM when it checks for changes.

We can also use `<React.Fragment>` instead of an array, we don't have to keep track of `key` props or use commas, it **works as a regular element without rendering any extra DOM elements**.

```javascript
function MyComponent() {
        let data = "world";
        return (
          <React.Fragment>
            <h1>Hello</h1>
            <h2>{data}</h2>
          </React.Fragment>
        );
      }
```