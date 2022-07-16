# Forms

## Table of contents

1. [Forms 101](#forms-101)
2. [The Basic Button](#the-basic-button)
3. [Events and Event Handlers](#events-and-event-handlers)
4. [Text Input](#text-input)
5. [Uncontrolled vs. Controlled Components](#uncontrolled-vs-controlled-components)
6. [Multiple Fields](#multiple-fields)
7. [On Validation](#on-validation)

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
```

The only difference in our `input` is that we've removed the `ref` `prop` and replaced it with both a `value` and an `onChange` `prop`. Now that the `input` is controlled, its `value` will always be set equal to a property of our `state`. In this case, that property is `name`, so the `value` of the `input` is `this.state.name`. While not strictly necessary, it's a good habit to provide sane defaults for any properties of state that will be used in our component. Because we now use `state.name` for the `value` of our `input`, we'll want to choose what value it will have before the user has had a chance to provide one. In our case, we want the field to be empty, so the default value will be an empty string

```javascript
state = {
  name: "",
  names: [],
};
```

To make our `input` operational, we'll need to listen to its `onChange` events and use those to update the `state`. To achieve this, we've created an event handler for `onChange`. This handler is responsible for updating our `state` so that `state.name` will always be updated with what the user has typed into the field. We've created the method `onNameChange()` for that purpose.

```javascript
onNameChange = (evt) => {
  this.setState({ name: evt.target.value });
};
```

The user interacts with the field. This triggers an `onChange` event which calls our `onNameChange()` handler. It updates the `state`, and this in turn triggers `render()` to update the field with the new `value`. When the user submits the form, `onFormSubmit()` is called, and we need that method to add the entered name (`state.name`) to the names list (`state.names`).

```javascript
onFormSubmit = (evt) => {
  const names = [...this.state.names, this.state.name];
  this.setState({ names: names, name: "" });
  evt.preventDefault();
};
```

---

## Multiple Fields

If we continue our current approach and create more controlled components, each with a corresponding state property and an `onChange` handler, our component will become quite verbose.

```javascript
state = {
  fields: {
    name: "",
    email: "",
  },
  people: [],
};
```

The `fields` object can store state for as many inputs as we'd like. Instead of creating an `onChange` handler for each input, we can create a single method that accepts change events from all of our input.

```javascript
  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder="Name"
            name="name"
            value={this.state.fields.name}
            onChange={this.onInputChange}
          />

          <input
            placeholder="Email"
            name="email"
            value={this.state.fields.email}
            onChange={this.onInputChange}
          />

          <input type="submit" />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {this.state.people.map(({name, email}, i) => (
              <li key={i}>
                {name} ({email})
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
```

We've added a second `input` to handle email addresses. We've changed the `value` `prop` of the `input` fields so that they don't access attributes on the root of the `state` object. Instead they access the attributes of `state.fields` Both `input` fields heve their `onChange` `prop` set to the same event handler, `onInputChange()`. Our `input` fields now have a `name` `prop`. To allow our general event handler, `onInputChange()`, to be able to tell where the change event came from and where we should store it in our state , we provide that `name` `prop` so that it can be pulled off of the event via its target attribute.

```javascript
onInputChange = (evt) => {
  const fields = Object.assign({}, this.state.fields);
  fields[evt.target.name] = evt.target.value;
  this.setState({ fields });
};
```

The two key differences are that:

1. we are updating a value nested in the `state` (e.g. updating `state.fields.email` instead of `state.email`), and
2. we're using `evt.target.name` to inform which attribute of `state.fields` needs to be updated.

To properly update our state, we first grab a local reference to `state.fields`. Then, we use information from the event (`evt.target.name` and `evt.target.value`) to update the local reference. Lastly, we `setState()` with the modified local reference.

```javascript
onFormSubmit = (evt) => {
  const people = [...this.state.people, this.state.fields];
  this.setState({
    people,
    fields: {
      name: "",
      email: "",
    },
  });
  evt.preventDefault();
};
```

In `onFormSubmit()` we first obtain a local reference to the list of people who have signed up, `this.state.people`. Then, we addd our `this.state.fields` object onto the `people` list. Finally, we use `this.setState()` to simultaneously update our list with the new information and clear all the fields by returning `state.fields` to the empty defaults.

---

## On Validation

Validation is so central to building forms that it's rare to have a form without it. It can be both on the level of the individual field and on the form as a whole. When you validate on an individual field, you're making sure that the user has entered data that conforms to your application's expectations and constraints as it relates to that piece of data. Validation on the form as a whole is slightly different. Here is where you'll make sure that all required fields have been entered. This is also a good place to check for internal consistency. There are trade-offs for how and when we validate. On some fields we might want to give validation feedback in real-time. We also have options for how we display validation errors. To add validation to our sign-upp we've made some changes:

1. add a place in `state` to store validation errors if they exist
2. change our `render()` method so it will show validation error messages with red text next to each field
3. add a new `validate()` method that takes our `fields` object as an argument and returns a `fieldErrors` object
4. `onFormSubmit()` will call the new `validate()` method to get the `fieldErrors` object, and if there are errors it wil add them to the state and return early without adding the person to the list

```javascript
state = {
  fields: {
    name: "",
    email: "",
  },
  fieldErrors: {},
  people: [],
};
```

```javascript
 render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder="Name"
            name="name"
            value={this.state.fields.name}
            onChange={this.onInputChange}
          />

          <span style={{color: 'red'}}>{this.state.fieldErrors.name}</span>

          <br />

          <input
            placeholder="Email"
            name="email"
            value={this.state.fields.email}
            onChange={this.onInputChange}
          />

          <span style={{color: 'red'}}>{this.state.fieldErrors.email}</span>

          <br />

          <input type="submit" />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {this.state.people.map(({name, email}, i) => (
              <li key={i}>
                {name} ({email})
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
```

There are two new `span` elements, one for each field. Each `span` will look in the appropriate place in `state.fieldErrors` for an error message. If one is found it will be displayed in red next to the field. It is after the user submits the form that we will check the validity of their input. So the appropriate place to begin validation is in the `onFormSubmit()` method. We'll want to create a standalone function for that method to call

```javascript
validate = (person) => {
  const errors = {};
  if (!person.name) errors.name = "Name Required";
  if (!person.email) errors.email = "Email Required";
  if (person.email && !isEmail(person.email)) errors.email = "Invalid Email";
  return errors;
};
```

[^1]: [SyntheticEvent](https://reactjs.org/docs/events.html)
