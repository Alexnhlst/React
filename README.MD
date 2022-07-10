# Nested and Class Components :package:

## Table of contents

1. [Call-Site Nesting](#call-site-nesting)
2. [Definition-Site Nesting](#definition-site-nesting)
3. [Nesting Components into Components](#nesting-components-into-components)
4. [Class Components](#class-components)
5. [createReactClass()](#createreactclass)
6. [render()](#render)
7. [getInitialState()](#getinitialstate)
8. [Interaction](#interaction)
9. [setState()](#setstate)

---

## Call-Site Nesting

Let's create a `<p>` element with an `<em>` element and a text element as a children.

```javascript
<p>
    <em>Hello</em>, world!
</p>

// This would translate to the plain JavaScript version
React.createElement(
    "p", // first
    null, // second
    React.createElement("em", null, "Hello"), // third
    ", world!" // fourth
)
```

Here, we add a child element as content to another (parent) element and the parent will render it as a child node into the virtual DOM tree.

---

## Definition-Site Nesting

How to nest something inside a custom component we've created? For this, we need the `children` prop. It is basically a reference to the "content" of our component.

```javascript
<RedText>Hello, world!</RedText>
```

The implementation of this component could be as follows:

```javascript
function RedText(props) {
    return <p style={{ color: "red" }}>{props.children}</p>
}
```

`RedText`...
- uses a `<p>` its base element
- styles it with an in-line style
- passes the `children` prop into the `<p>` elements content 

The last point is the crucial part; it passes `children` on to another element **without looking at it.** `children` will have a reference to the `"Hello, world!"` string from above, but we could pass anything here.

---

## Nesting Components into Components

We can pass components into components.

```javascript
// This component just wraps its children in an <li> element
function Item(props) {
    return <li>{props.children}</li>;
}

// This component wraps its children into an <ul> element
function List(props) {
    return <ul>{props.children}</ul>;
}

// If the <List> is created without children it gets a default child
List.defaultProps = {
    children: <Item>Empty</Item>,
};

// Now we render two <List>s, without and with Items
let reactElement = (
    <div>
        <List />
        <List>
            <Item>First</Item>
            <Item>Second</Item>
            <Item>Third</Item>
        </List>
    </div>
);
```

>The `children` prop is a bit special because **it can have different types**. If a component gets passed only **one** child its `children` prop will hold a reference to **this one** child, but if a component gets passed multiple children, the `children` prop will hold a reference to an opaque data-structure that holds all the child elements, a child collection. Also, the `children` prop can be `undefined` if nothing has been passed to the component. For this problem React offers the `React.Children` object, which comes with a few handy utility methods like `.map()`, `.count()` or `.toArray()`

---

## Class Components

To create a stateful component, we have to create a `class` instead of a simple `function`

>Class components are also called **stateful components**, because they can have their own state, but not all class components have state.

For example, say we wanted to create a component which keeps track of a counter and we click on a button to increment that counter.

```javascript
function Counter(props) {
    return (
        <div>
            <span>{props.count}</span>
            <button onClick={props.onClick}>+ 1</button>
        </div>
    )
}
```

We display the `count` prop and use the `onClick` prop to pass data up. But parent has to handle the click and pass a updated `count` down to the `Counter`. There is no way to store the value of the counter (the state) in this component. If we define `Parent` as functioonal component, we can create the `count` variable and the `onClick` handler that increments this variable; and then pass them into the `props` of our `Counter` component, but we would have no way to tell React that we need to re-render these two components.

```javascript
function Parent(props) {
    let count = 0;

    function handleClick() {
        count++;
        // ...?
    }

    return <Counter count={count} onClick={handleClick}/>;
}
```

To fix this, a class component is the way to go here, because **it can store its state without the need of a parent:**

```javascript
let Counter = createReactClass({
    getInitialState: function() {
        return { count: 0 };
    },

    handleClick: function(event) {
        this.setState(function(prevState) {
            return { count: prevState.count + 1 };
        });
    },

    render: function() {
        return (
            <div>
                <span>{this.state.count}</span>
                <button onClick={this.handleClick}>+ 1</button>
            </div>
        )
    }
})
```

---

## createReactClass()

The `createReactClass()` function is the ES5 way of creating class components with React. In version 16 of React it was moved to its own package, but it can be included with a simple `<script>` tag

```html
<script src="https://unpkg.com/create-react-class@15.6.3/create-react-class.js"></script>
```

This function returns a new component class. Classes in JavaScript are also functions, so **we can change functional components to class components transparently**. Simply set an `UpperCase` variable name for it and use it as a JSX element.

---

## render()

The `createReactClass()` function takes a config object that needs to define some functions. The most important one being the `render()` method. As you might have noticed, this function looks like our functional component function. When using class-based components the `render()` method doesn't receive `props` via argument, but instead we need to use `this.props` to access the props. The same idea goes for `state` - it won't be passed down via argument, but needs to be accessed via `this.state`:

```javascript
// ...
render: function () {
    return ;(
    <div>
        <span>{this.state.count}</span>
        <button onClick={this.handleClick}>+ 1</button>
    </div>
    );
}
// ...
```

`this` will be **the current instance of the component**, when inside the `render()` method, so we can also access all the other things we passed to `createReactClass()` function in the config object, like the custom method `handleClick`. This method is neither a prop nor part of the state, so we can access it with `this.handleClick`.

---

## getInitialState()

`getInitialState()` will be called when an instance of the component is created, right before the first call to the `render()` method.

```javascript
// ...
getInitialState: function() {
    return { count: 0 };
}
// ...
```

It needs to `return` a value that defines the state of our component. This value is then available in the `render()` method via `this.state.count`.

>When you're getting started with React, the convention is that state is tipically an object. An object is convenient because you can store several key-value pairs.

---

## Interaction

We want interaction in our counter, so we've created a `<button>` and added our custom `handleClick` method as an `onClick` handler.

```javascript
// ...
handleClick: function(event) {
    this.setState(function(prevState) {
        return { count: prevState.count + 1 };
    })
}
// ...
```

---

## setState()

>The `setState()` method is the center of state management in React. Every time you call it, your `render()` method is called with an updated `this.state`

The `setState()` method can be called with an object or with a callback function. If we call it with an object, this object gets shallow[^1] merged with the current object inside `this.state`.
This is useful when we don't depend of the previous state. For example, when we sent a request to a server and receive an error.

```javascript
this.setState({loading: false, error: "404 - File not found."});
```

If we call it with a callback function, the callback receives the previous state as an argument and needs to `return` the new value that is merged with `this.state`, just like `getInitialState()` did.

>Only call the setState() method with an object if the new state doesn't depend on the previous state. If you find yourself writing things like {count: this.state.count + 1} you need to switch to the callback version and use the first/prevState callback argument instead of this.state for your calculations!

In our example, we use the callback version, because we increment the counter based on the previous state. This version is asynchronous, it tells React that we want to update state and give it a callback to do so. React will execute this callback function some time in the future. When the callback has been executed, our render() method will be called again, in this method this.state will have the values we updated in the callback.

>This model of interactions is called unidirectional dataflow and is a core concept of React. It stands in contrast to the two-way-binding known from other frameworks.


[^1]: [shallow](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-are-merged)