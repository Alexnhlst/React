# ES2015
## Table of contents

1. [ES2015](#es2015-1)
2. [Block Scope Variables](#block-scope-variables)
3. [Destructuring](#destructuring)
4. [Arrow Functions](#arrow-functions)
5. [Classes](#classes)
    - [Method Binding](#method-binding)
6. [Modules](#modules)
    - [Exporting and Importing](#exporting-and-importing)

---

## ES2015

ECMAScript is the name of the specification of JavaScript. When new language features are added to JavaScript, they usually come from proposals to this specification. In June 2015 the 6th version of ECMAScript was released, called ECMAScript 2015 or short ES2015. It was the most significant change to the language ever. It added new syntax for:
- classes
- functions
- block scoped and immutable variable declarations
- promises
- and much more
Since React wanted to be future proof and these changes were effectively standardized and soon to be readily available in all major browsers, the React team decided to incorporate them into the React code-base and emphasize their use in their docs.

---

## Block Scope Variables

There are two new ways to declare variables: `let` and `const`.

```JavaScript
var a = 1; // old way
let b = 2;
const c = 3;
```

They both have block scope rather than function scope. This means if you declare a variable with `let` or `const` in a code-block these variables will only be visible inside this block. A code-block is some part of the code that is enclosed in curly braces `{}`. Also, `const` variables can't be changed after their first assignment and have to be assigned a value at declaration time.

---

## Destructuring

One very heavily used feature, especially when working with props and state in React, is destructuring. It allows us to extract values as new variables from existing ones. When used directly on function arguments, it often gets rid of extra variables. It works with objects and arrays. Destructuring an argument can happen directly inside the parenthesis of the function.

```JavaScript
function MyButton(props) {
    return <button onClick={props.onButtonClick}>{props.children}</button>
}
```

Since `props` is an object, we can use the object-destructuring syntax on it:

```JavaScript
function MyButton({children, onButtonClick}) {
    return <button onClick={onButtonClick}>{children}</button>
}
```

---

## Arrow Functions

There is a new way to declare a function, the arrow function. This arrow syntax is often used to define anonymous functions or callbacks to event-handler props in React.

```JavaScript
<button
  onClick={function(e) {
    console.log(e);
  }}
>
  click me
</button>
```

becomes:

```JavaScript
<button onClick={(e) => console.log(e)}>click me</button>
```

The parenthesis around the arguments is optional when only one argument is used, and the curly braces around the body are optional too if the last expression should be returned. The longer form of the above example callback would be `(e) => {return console.log(e)}`. Besides being often faster to type, these functions have another benefit, they keep their context, so no re-binding of this before using them. Which is especially handy for callbacks that are executed asynchronously sometime in the future.

---

## Classes

One of ES2015 additions that lead to a considerable change in React code-bases were classes. While there were many ways to define a class system on top of JavaScripts prototype-based system, with classes finally getting there own standardized syntax, all these ways now converged. In this book, we always used the `createReactClass()` function to create class components, but with ES2015's class syntax, this function isn't needed anymore.

```JavaScript
var MyComponent = createReactClass({
  render: function() {
    return <h1>{this.props.name}</h1>;
  }
});
```

becomes:

```JavaScript
class MyComponent extends React.Component {
  render() {
    return <h1>{this.props.name}</h1>;
  }
}
```

>React tries to keep inheritance to a minimum. We only extend the React base-classes `React.Component` and `React.PureComponent` into concrete components we use in our app. We never create own base components we extend all our components from later.

### Method Binding

The `createReactClass()` function binds our methods to the components instance; the ES2015 class syntax don't. All the methods called by React, like render() or the lifecycle methods, have the right this, but our methods which we may create for event handlers don't.

```JavaScript
class MyComponent extends React.Component {
  constructor() {
    super();
    this.value = 10;
  }

  handleClick(e) {
    console.log(this.value);
  }

  render() {
    return <button onClick={this.handleClick}>Click me!</button>;
  }
}
```

This example uses the `constructor()` method to initialize an instance attribute `value`.

>The `super()` function has to be called before accessing `this` in a constructor of an extending class. Since we extend `React.Component` we need to call it, or else we get an error.

Later we try to access `this.value` in our event handler method `handleClick()`. This would result in an `undefined` logging, because `this` can be anything. The method shorthand syntax is just a shorthand for `function() {}` and not for `() => {}` and only the new arrow syntax binds `this` correctly.

>The `this` keyword is a tricky thing in JavaScript because non-arrow-functions don't bind themselfs to the `this` of the place they're defined, but to the `this` of the place they're executed. This is also true for methods. If we pass a method as an event-handler to an element;`this` isn't our component anymore at the time the click is triggered and so we don't have access to the components attributes.

To fix this, we can either wrap the method with an arrow function in the `render()` method or bind it manually in the constructor.

```JavaScript
// ...
render() {
  return <button onClick={e => this.handleClick(e)}>Click me!</button>;
}
// ...
```

The arrow function is bound to the `this` of the `render()` method, so it's available when the event triggers too.


```JavaScript
// ...
constructor() {
  super();
  this.value = 10;
  this.handleClick = this.handleClick.bind(this);
}
// ...
```

---

## Modules

The next significant addition is modules. They are often called ES-modules, because, like with classes, JavaScript developers already created their systems and this is an attempt to standardize all of them to improve integration. React project started to integrate this system early on, so you certainly will encounter it in your projects.

### Exporting and Importing

The first principle of this modules system is, by default all values are private to the file, so you don't can create global variables by accident. If you need a global variable, you have to attach it explicitly to the global `window` object. If we want to use a value outside of a file, we need to `export` it. In the context of React, this is significant, since most custom components map directly to one file. There are two ways to `export`. We can `export default ...`, which is often used for the main export of the file. We can also `export ...`, which leads to a named export, which allows for multiple exports in one file. In other files, we can then `import` these exported values, depending on how they were exported. If the variable was exported as `default` we could choose our name freely in the importing file. If the variable was exported with a name, we have to use that name in the importing file.

Here some examples:

```JavaScript
// MyComponent.js
function MyComponent() {
  return <h1>Hello</h1>;
}
export default MyComponent;

// x.js
import MyComponent from "./MyComponent.js";
```