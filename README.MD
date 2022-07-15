# Forms

## Table of contents

1. [Forms 101](#forms-101)
2. [The Basic Button](#the-basic-button)
3. [Events and Event Handlers](#events-and-event-handlers)
4. [Text Input](#text-input)

---

## Forms 101

Forms are one of the most crucial parts of our applications. While we get some interaction through clicks and mouse moves, it's really through forms where we'll get the majority of our rich input from our users. Creating a rich, interactive, easy to use form can often involve a significant amount of programming:

- Form inputs modify data, both on the page and the server
- Changes often have to be kept in sync with data elsewhere on the page
- Users can enter unpredictable values, some that we'll want to modify or reject outright
- The UI needs to clearly state expectations and errors in the case of validation failures
- Fields can depend on each other and have complex logic
- Data collected in forms is often sent asynchronously to a back-end server, and we need to keep the user informed of what's happening
- We want to be able to test our forms

---

## The Basic Button

```javascript
render() {
    return (
      <div>
        <h1>What do you think of React?</h1>

        <button
          name='button-1'
          value='great'
          onClick={this.onGreatClick}
        >
          Great
        </button>

        <button
          name='button-2'
          value='amazing'
          onClick={this.onAmazingClick}
        >
          Amazing
        </button>
      </div>
    );
  }
```

The important part to pay attention to is the `onClick` `prop` of the `button` elements. When a `button` is clicked, if it has a function set as its `onClick` `prop`, that function will be called.

```javascript
onGreatClick = (evt) => {
  console.log("The user clicked button-1: great", evt);
};

onAmazingClick = (evt) => {
  console.log("The user clicked button-2: amazing", evt);
};
```

> In the `onClick` handler we pass `this.onGreatClick` and not `this.onGreatClick()`. In the first case (without parens), we're passing the function, whereas in the second case we're passing the result of calling the function

---

## Events and Event Handlers

Our `onClick` functions accept and argument, `evt`. This is because these functions are event handlers. Handling events is central to working with forms in React. When we provide a function to an element's `onClick` `prop`, that function becomes an event handler. The function will be called when that event occurs, and it will receive an event object as its argument. When the `button` element is clicked, the corresponding event handler function is called and it is provided with a mouse click event object. This object is a `SyntheticMouseEvent`.[^1] This object is just a cross-browser wrapper around the browser's native `MouseEvent`, and you'll be able to use it the same way you would a native DOM event. In addition, if you need the original native event you can access it via the `nativeEvent`. Event objects contain lots of useful information about the action that occurred. A MouseEvent for example, will let you see the x and y coordinates of the mouse at the time of the click, whether or not the shift key was pressed, and (most useful for this example) a reference to the element that was clicked.

The two functions can be refactored with the use of `evt`. `evt` has an attribute `target` that is a reference to the button that the user clicked. This way we can access the button the user clicked without creating a function for each button.

```javascript
onButtonClick = (evt) => {
  const btn = evt.target;
  console.log(`The user clicked ${btn.name}: ${btn.value}`);
};
```

---

## Text Input

```javascript
  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder='Name'
            ref='name'
          />

          <input type='submit' />
        </form>
      </div>
    );
  }
```

We have a `form` element with two child elements: a text field and a submit button. We've added an `onSubmit` event handler to the `form` element and given the text field a `ref` `prop` of `'Name'`

[^1]: [SyntheticEvent](https://reactjs.org/docs/events.html)
