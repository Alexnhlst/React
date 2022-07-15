# Forms

## Table of contents

1. [Forms 101](#forms-101)
2. [The Basic Button](#the-basic-button)
3. [Events and Event Handlers](#events-and-event-handlers)
4. [Text Input](#text-input)
5. [Uncontrolled vs. Controlled Components](#uncontrolled-vs-controlled-components)

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

We have a `form` element with two child elements: a text field and a submit button. We've added an `onSubmit` event handler to the `form` element and given the text field a `ref` `prop` of `'Name'`. By using an `onSubmit` event handler on the `form` element this example will behave a little differently than before. One change is that the handler will be called either by clicking the "Submit" button, or by pressing "enter"/"return" while the `form` has focus. This is more user-friendly than forcing the user to click the "Submit" button. However, because our event handler is tied to the `form`, the event object argument to the handler is less useful than it was in the previous example. In React, if we want to easily access a DOM element in a component we can use `refs` (references)

```javascript
onFormSubmit = (evt) => {
  evt.preventDefault();
  console.log(this.refs.name.value);
};
```

> Use `preventDefault()` with the `onSubmit` handler to prevent the browser's default action of submitting the form

By using `this.refs.name` we gain a reference to our text field element and we can access its `value` property. That `value` property contains the text that was entered into the field.

```javascript
module.exports = class extends React.Component {
  static displayName = "04-basic-input";
  state = { names: [] };
};
```

> `displayName` is a static property. When a property is static, that means it is a class property (instead of an instance property).

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

        <div>
          <h3>Names</h3>
          <ul>
            { this.state.names.map((name, i) => <li key={i}>{name}</li>) }
          </ul>
        </div>
      </div>
    );
  }
```

Since `this.state.names` is an array, we can take advantage of its `map()` method to return a `li` child element for each name in the array.

> React will complain when we have children in an array or iterator and they don't have a `key` `prop`. React wants this information to keep track of the child and make sure that it can be reused between render passes. We won't be removing or reordering the list here, so it is sufficient to identify each child by its index. If we wanted to optimize rendering for a more complex use-case, we could assign an immutable id to each name that was not tied to its value or order in the array. This would allow React to reuse the element even if its position or value was changed.

The `onFormSubmit()` method needs to update the `state` with the new name. To add a name to the `names` array in our `state` we use `this.setState()` to mutate our `state` object, which will then trigger a new call to `render()`. The way to do this properly is to:

1. create a new variable that copies our current `names`
2. add our new name to that array
3. use that variable in a call to `this.setState()`

We also want to clear the text field so that it's ready to accept additional user input.

```javascript
onFormSubmit = (evt) => {
  const name = this.refs.name.value;
  const names = [...this.state.names, name];
  this.setState({ names: names });
  this.refs.name.value = "";
  evt.preventDefault();
};
```

1. User enters a name and clicks "Submit"
2. `onFormSubmit` is called
3. `this.refs.name` is used to access the value of the text field
4. The name is added to our `names` list in the `state`
5. The text field is cleared so that it is ready for more input
6. `render` is called and displays the updated list of names

---

## Uncontrolled vs. Controlled Components

We took advantage of `refs` to access the user's input. By using `refs` this way, we opt out of a primary advantage of using React. We've accessed the DOM directly to retrieve the name from the text field, as well as manipulate the DOM directly by resetting the field after a name has been submitted. With React we shouldn't have to worry about modifying the DOM to match application state. We should concentrate only on altering `state` and rely on React's ability to efficiently manipulate the DOM to match. This provides us with the certainty that for any given value of `state`, we can predict what `render()` will return and therefore know what our app will look like. An uncontrolled component, like the one created before, is another way of saying that React does not "control" how it is rendered -- specifically its value. In other words, React is hands-off, and allows it to be freely influenced by user interaction. This means that knowing the application state is not enough to predict what the page (and specifically the `input` field) looks like. Because the user could have typed (or not typed) input into the field, the only way to know what the `input` field looks like is to access it via `refs` and check its `value`. There is another way. By converting this field to a "controlled component", we give React control over it. It's `value` will always be specified by `render()` and our application state. When we do this, we can predict how our application will look by examining our `state` object. By directly tying our view to our application state we get certain features for very little work.

Converting an uncontrolled `input` component to a controlled one requires three things. First, we need a place in `state` to store its value. Second, we provide that location in `state` as its `value` `prop`. Finally, we add an `onChange` handler that will update its value in `state`

1. The user enters/changes the input
2. The `onChange` handler is called with the change event
3. using `event.target.value` we update the `input` element's `value` in `state`
4. `render()` is called and the `input` is updated with the new value in `state`

```javascript
render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder='Name'
            value={this.state.name}
            onChange={this.onNameChange}
          />

          <input type='submit' />
        </form>

        <div>
          <h3>Names</h3>
          <ul>
            { this.state.names.map((name, i) => <li key={i}>{name}</li>) }
          </ul>
        </div>
      </div>
    );
  }
};
```

[^1]: [SyntheticEvent](https://reactjs.org/docs/events.html)
