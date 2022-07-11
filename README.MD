# Refs

## Table of contents

1. [Refs](#refs)
2. [Callback Refs](#callback-refs)
3. [Ref Objects](#ref-objects)

---

## Refs

Most of the time we model our interactions with the **unidirectional data-flow** pattern provided by React via `props` and `state`, but sometimes we need direc access to the DOM elements. A `ref` is a reference to a DOM element we can store in a variable for later use.

>Using refs is not the typical architecture for the bulk of our React app. Refs are considered a "last resort" when we must directly manipulate the DOM.

To create a ref we have to supply a `ref` prop to the element we want to reference later. The value of this prop can be:
- A callback, that gets the DOM elements reference as the first argument
- A ref object, created via the `React.createRef()` method

---

## Callback Refs

```javascript
let App = createReactClass({
    button: null,
    handleRef: function(button) {
        this.button = button;
    },

    handleClick: function() {
        console.log(this.button);
    },

    render: function() {
        return <button ref={this.handleRef} onClick={this.handleClick} />;
    }
})
```

When the `<App>` component is mounted in the DOM, React calls the `render()` method. When we render the `<button>`, React calls the `handleRef()` method, that we supplied to the `ref` prop of the `<button>`. In the `handleRef()` method we store the reference (which React passes to our method as the first argument). React will call this method every time a new rendering of the `<App>` component replaces our `<button>` element in the DOM. in `handleClick`, when we click the button, we log the current element stored in `this.button`. The callback version is good if we need to do some extra work with our reference when it changes, but most of the time we want to store the reference and update it when it changes and nothing else.


---

## Ref Objects

For this React supplies us with a extra method `React.createRef()`

```javascript
let App = createReactClass({
    button: null,
    getInitialState: function() {
        this.button = React.createRef();
        return {};
    },

    handleClick: function() {
        console.log(this.button.current);
    },

    render: function() {
        return <button ref={this.handleRef} onClick={this.handleClick} />;
    }
})
```

In this version, we create the ref with the `React.createRef()` method. We have to call it when the `<App>` component is created, and before it's mounted to the DOM, so we have to do it inside the `getInitialState()` lifecycle method. Then we can pass the ref stored inside `this.button` into the `ref` prop of our `<button>` element. The main difference in this example is the fact that we don't have to handle the update and storage of our element reference manually anymore, the ref object stored in `this.button` keeps track of all the renders for us. Also, we now have to use `this.button.current` to get the reference, and not `this.button`