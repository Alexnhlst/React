# Forms

## Table of contents

1. [Forms 101](#forms-101)
2. [The Basic Button](#the-basic-button)
3. [Events and Event Handlers](#events-and-event-handlers)
4. [Text Input](#text-input)
5. [Uncontrolled vs. Controlled Components](#uncontrolled-vs-controlled-components)
6. [Multiple Fields](#multiple-fields)
7. [On Validation](#on-validation)
8. [Remote Data](#remote-data)
9. [Async Persistence](#async-persistence)

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

Our `validate()` method is pretty simple and has two goals. First, we want to make sure that both name and email are present. By checking their truthiness we can know that they are defined and not empty strings. Second, we want to know that the provided email address looks valid. This is actually a bit of a thorny issue, so we rely on `validator`[^2] to let us know.

```javascript
onFormSubmit = (evt) => {
  const people = [...this.state.people];
  const person = this.state.fields;
  const fieldErrors = this.validate(person);
  this.setState({ fieldErrors });
  evt.preventDefault();

  if (Object.keys(fieldErrors).length) return;

  this.setState({
    people: people.concat(person),
    fields: {
      name: "",
      email: "",
    },
  });
};
```

To use the `validate()` method, we get the current values of our fields from `this.state.fields` and provide it as the argument. It will either return an empty object if there are no issues, or if there are issues, it will return an object with keys corresponding to each field name and values corresponding to each error message. In either case, we want to update our `state.fieldErrors` object so that `render()` can display or hide the messages as necessary. If the validation errors object has any keys (`Object.keys(fieldErrors).length > 0`) we know there are issues.

Our form component is responsible for running the valiodations on the form as a whole as well as the individual validation rules for each field. It would be ideal if each field was responsible for identifying validation errors on its own input, and the parent form was only responsible for identifying issues at the form-level. To do this we're first going to create a new separate `Field` component, and we will use it instead of `input` elements in the form. Before we get into the creation of this new component, it will be useful to think of it at a high level in terms of inputs and outputs. In other words, "what information do we need to provide this component?", and "what kinds of things would we expect in return?" These inputs are going to become this component's `props` and the output will be used by any event handlers we pass into it. For the new Field component to do its job it will need the following:

- `placeholder`: This will be passed straight through to the `input` child element. Similar to a label, this tells the user what data to the `Field` expectations
- `name`: We want this for the same reason we provide `name` to `input` elements: we'll use this in the event handler decide where to store input data and validation errors
- `value`: This is how our parent form can initialize the `Field` with a value, or it can use this to update the `Field` with a new value.
- `validate`: A function that returns validation errors when running
- `onChange`: An event handler to be run when the `Field` changes. This function will accept an event object as an argument

We're able to set up `propTypes` on our new `Field` component:

```javascript
static propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  validate: PropTypes.func,
  onChange: PropTypes.func.isRequired
}
```

There are only two pieces of data that `Field` will need, the current `value` and `error`.

```javascript
state = {
  value: this.props.value,
  error: false,
};
```

One key difference is that our `Field` has a parent, and sometimes this parent will want to update the `value` `prop` of our `Field`. To allow this, we'll need to create a new lifecycle method, `getDerivedStateFromProps()` to accept the new `value` and update the `state`

```javascript
getDerivedStateFromProps(nextProps) {
  return {value: nextProps.value}
}
```

The `render()` method of `Field` should be pretty simple

```javascript
render() {
  return (
    <div>
      <input
        placeholder={this.props.placeholder}
        value={this.state.value}
        onChange={this.onChange}
      />
      <span style={{color: 'red'}}>{this.state.error}</span>
    </div>
  );
}
```

For the `input` element, the `placeholder` will be passed in from the parent and is available from `this.props.placeholder`. The `value` of the `input` and the error message in the `span` will both be stored in the `state`. `value` comes from `this.state.value` and the error message is at `this.state.error`. Lastly, we'll set an `onChange` event handler that will be responsible for accepting user input, validating, updating state, and calling the parent's event handler as well.

```javascript
onChange (evt) {
  const name = this.props.name;
  const value = evt.target.value;
  const error = this.props.validate ? this.props.validate(value) : false;

  this.setState({value, error});

  this.props.onChange({name, value, error});
}
```

`this.onChange` handles four different responsibilities in as many lines. The event object gives us the current text in the `input` via its `target.value` property. Once we have that, we see if it passes validation. If `Field` was given a function for its `validate` `prop`, we use it here. If one was not given, we don't have to validate the input and `error` sets to `false`. Once we have both the `value` and `error` we can update our `state` so that they both appear in `render()`. However, it's not just the `Field` component that needs to be updated with this information. When `Field` is used by a parent component, it passes in its own event handler in as the `onChange` `prop`. We call this function so that we can pass information up the parent. Here in `this.onChange()`, it is available as `this.props.onChange()`, and we call it with three pieces of information: the `name`, `value`, and `error` of the `Field`.

```javascript
  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <Field
            placeholder="Name"
            name="name"
            value={this.state.fields.name}
            onChange={this.onInputChange}
            validate={val => (val ? false : 'Name Required')}
          />

          <br />

          <Field
            placeholder="Email"
            name="email"
            value={this.state.fields.email}
            onChange={this.onInputChange}
            validate={val => (isEmail(val) ? false : 'Invalid Email')}
          />

          <br />

          <input type="submit" disabled={this.validate()} />
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

`Field` is a drop-in replacement for `input`. All the `props` are the same as they were on `input`, except we have one additional `prop` this time: `validate`. In the `Field` component's `onChange()` method, we make a call to the `this.props.validate()` function. What we provide as the `validate` `prop` to `Field`, will be that function. Its goal is to take user provided input as its argument and give a return value that corresponds to the validity of that input. If the input is not valid, `validate` will return an error message. Otherwise, it returns `false`. For the "name" `Field` the `validate` `prop` we're just checking for a truthy value. As long as there are characters in the box, validation will pass, otherwise we return the `'Name Required'` error message. For the "email" `Field`, we're going to use the `isEmail()` function that we imported from the `validator` module. If that function returns `true`, we know it's a valid-looking email and validation passes. If not, we return the `'Invalid Email'` message. We conditionally disable the submit button. To do this, we set the value of the `disabled` `prop` to the return value of `this.validate()`. Because `this.validate()` will have a truthy return value if there are validation errors, the button will be disabled if the form is not valid.

```javascript
onInputChange = ({ name, value, error }) => {
  const fields = Object.assign({}, this.state.fields);
  const fieldErrors = Object.assign({}, this.state.fieldErrors);

  fields[name] = value;
  fieldErrors[name] = error;

  this.setState({ fields, fieldErrors });
};
```

Previously, the job of `onInputChange()` was to update `this.state.fields` with the current user input values. In other words, when a text field was edited, `onInputChange()` would be called with an event object. That event object had a `target` property that referenced the `input` element. Using that reference, we could get the `name` and `value` of the `input`, and with those, we would update `state.fields`. This time around `onInputChange()` has the same responsibility, but it is our `Field` component that calls this function, not `input`. This means that instead of using `evt.target.name` or `evt.target.value` as we did before, we get `name` and `value` directly from the argument object. In addition, we also get the validation error for each field. This is necessary -- for our form component to prevent submission, it will need to know about field-level validation errors. Once we have the `name`, `value`, and `error`, we can update two objects in our `state`, the `state.fields` object we used before, and a new object, `state.fieldErrors`. With both `render()` and `onInputChange()` updated, we again have a nice feedback loop set up for our `Field` components:

- First, the user types into the `Field`
- Then, the event handler of the `Field` is called, `onInputChange()`
- Next, `onInputChange()` updates the `state`
- After, the form is rendered again, and the `Field` passed an updated `value` `prop`
- Then, `getDerivedStateFromProps()` is called in `Field` with the new `value`, and returns the new state
- Finally, `Field.render()` is called again, and the text field shows the appropriate input and validation error.

```javascript
onFormSubmit = (evt) => {
  const people = this.state.people;
  const person = this.state.fields;

  evt.preventDefault();

  if (this.validate()) return;

  this.setState({
    people: people.concat(person),
    fields: {
      name: "",
      email: "",
    },
  });
};
```

The objective of `onFormSubmit()` hasn't changed. It is still responsible for either adding a person to the list, or preventing that behavior if there are validation issues. To check for validation errors, we call `this.validate()`, and if there are any, we return early before adding the new person to the list.

```javascript
  validate () {
    const person = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter((k) => fieldErrors[k])

    if (!person.name) return true;
    if (!person.email) return true;
    if (errMessages.length) return true;

    return false
  },
```

`validate()` is checking to make sure the data is valid at the form level. For the form to pass validation at this level it must satisfy two requirements: (1) neither field may be empty and (2) there must not be any field-level validation errors. To satisfy the first requirement, we access `this.state.fields` and ensure that both `state.fields.name` and `state.fields.email` are truthy. These are kept up to date by `onInputChange()`, so it will always match what is in the text fields. If either `name` or `email` are missing, we return `true`, signaling that there is a validation error. For the second requirement, we look at `this.state.fieldErrors`. `onInputChange()` will set any field-level validation error messages on this object. We use `Object.keys` and `Array.filter` to get an array of all present error messages. If there are any field-level validation issues, there will be corresponding error messages in the array, and its length will be non-zero and truthy. If that's the case, we also return `true` to signal the existence of a validation error.

---

## Remote Data

The most common example is to allow the user to select a car by year, make, and model. First the user selects a year, then the manufacturer, then the model. After choosing an option in one `select`, the next one becomes available. There are two interesting facets to building a component like this. First, not all combinations make sense. Second, we don't want to send the entire database of valid choices to the browser. Instead, the browser only knows the top level of choices. When the user makes a selection, we providee the selected value to the server and ask for next level. Because the next level of options come from the server, this is an asynchronous activity. Our app won't be interested in the user's car, but we will want to know what they're signing up for. Let's make this an app for users to learn more JavaScript by choosing a NodeSchool[^3] workshop to attend. We'll create a custom component to handle both the hierarchical and asynchronous nature of these fields. By using a custom component, our form will barely have to change. Any logic specific to the workshop selection will be hidden in the component. Before starting on our new `CourseSelect` component, we should think about how we want it to communicate with its form parent. This will determine the component's `props`. The most obvious on is `onChange()`. The purpose of this component is to help the user make a department/course selection and to make that data available to the form. Additionally, we'll want to be sure that `onChange()` is called with the same arguments we're expecting from other field components. We also want the form to be able to set this component's state if need be. This is particularly useful when we want to clear the selections after the user has submitted their info. For this we'll accept two props. One for `department` and one for `course`.

```javascript
static propTypes = {
  department: PropTypes.string,
  course: PropTypes.string,
  onChange: PropTypes.func.isRequired
}
```

Next, we can think about the `state` that `CourseSelect` will need to keep track of. The two most obvious pieces of state are `department` and `course`. Those will change when the user makes selections, and when the form parent clears them on a submit. `CourseSelect` will also need to keep track of available courses for a given department. When a user selects a department, we'll asynchronously fetch the corresponding course list. Once we have that list we'll want to store it in our `state` as `courses`. When dealing with asynchronous fetching, it's nice to inform the user that data is loading behind the scenes. We will also keep track of whether or not data is loading in our `state` as `_loading`

> The underscore prefix is just a convention to highlight that is purely presentational. Presentational state is only used for UI effects

```javascript
state = {
  department: null,
  course: null,
  courses: [],
  _loading: false,
};
```

This component's form parent will want to update the `department` and `course` `props`. Our `getDerivedStateFromProps()` method will use the update to appropriately modify the `state`

```javascript
getDerivedStateFromProps(update) {
  return {
    department: update.department,
    course: update.course
  }
}
```

The `render()` method is mainly composed of two functions, `renderDepartmentSelect()` and `renderCourseSelect()`

```javascript
render() {
  return (
    <div>
      {this.renderDepartmentSelect()}
      <br />
      {this.renderCourseSelect()}
    </div>
  )
}
```

`renderDepartmentSelect()` returns a `select` element that displays one of three options. The currently displayed option depends on the `value` `prop` of the `select`. The option whose `value` matches the `select` will be shown. The value of `select` is `this.state.department || ""`, if `this.state.department` is falsy (it is by default), the `value` will be an empty string and will match "Which department?" Otherwise, if `this.state.department` is either `"core"` or `"electives"`, it will display one of the other options. Because `this.onSelectDepartment` is set as the `onChange` `prop` of the `select`, when the user changes the option, `onSelectDepartment()` is called with the change event.

```javascript
onSelectDepartment = (evt) => {
  const department = evt.target.value;
  const course = null;
  this.setState({ department, course });
  this.props.onChange({ name: "department", value: department });
  this.props.onChange({ name: "course", value: course });

  if (department) this.fetch(department);
};
```

When the department is changed, we want three things to happen. First, we want to update `state` to match the selected department option. Second, we want to propagate the change via the `onChange` handler provided in the `props` of `CourseSelect`. Third, we want to fetch the available courses for the department. When we update the `state`, we update it to the value of the event's `target`, the `select`. The value of the `select` is the value of the chosen `option`. After the `state` is set with a new value, `render()` and `renderDepartmentSelect()` are run and a new option is displayed. We also reset the course. Each course is only valid for its department. If the department changes, it will no longer be a valid choice. Therefore, we set it back to its initial value, `null`. After updating `state`, we propagate the change to the component's change handler, `this.props.onChange`. Because we use the arguments as we have previously, this component can be used just like `Field` and can be given the same handler function. The only trick is that we need to call it twice, once for each input. Finally, if a department was selected, we fetch the course list for it.

```javascript
fetch = (department) => {
  this.setState({ _loading: true, courses: [] });
  apiClient(department).then((courses) => {
    this.setState({ _loading: false, courses: courses });
  });
};
```

The responsibility of this method is to take a `department` string, use it to asynchronously get the corresponding course list, `courses`, and update the `state` with it. However, we also want to be sure to affect the `state` for a better user experience. We do this by updating the `state` before the `apiClient` call. We know that we'll be waiting for the response with the new course list, and in that time we should show the user a loading indicator. To do that, we need our `state` to reflect our fetch state. Right before the `apiClient` call, we set the `state` of `_loading` to `true`. If `state._loading` is true, `renderCourseSelect()` only returns a single `img`: a loading indicator. Alternatively, if we're not loading, but a department has not been selected, an empty `span` is returned -- effectively hiding this half of the component. The biggest difference between `renderCourseSelect()` and `renderDepartmentSelect()` is that `renderCourseSelect()` dynamically populates the `option` children of the `select` The first option in this `select` is "Which course?" which has an empty string as its value. If the user has not yet selected a course, this is what they should see. The options that follow the first come from the course list stored in `state.courses`. To provide all the child `option` elements to the `select` at once, the `select` is given a single array as its child. The first item in the array is an element for our "Which course?" option. Then, we use the spread operator combined with `map()` so that from the second item on, the array contains the course options from `state`. Each item in the array is an `option` element. Like before, each element has text that it displaysas well as a value `prop`. If the `value` of the `select` matches the `value` of the `option`, that `option` will be displayed. By default, the `value` of the `select` will be an empty string, so it will match the "Which course?" `option`. Once the user chooses a course and we are able to update `state.course`, the corresponding course will be shown. Lastly, we provide a change handler function, `onSelectCourse(`) to the `select` `prop` `onChange`. When the user chooses a course, that function will be called with a related event object. We will then use information from that event to update the state and notify the parent.

```javascript
onSelectCourse = (evt) => {
  const course = evt.target.value;
  this.setState({ course });
  this.props.onChange({ name: "course", value: course });
};
```

Because we were careful to call the change handler from within `CourseSelect` (`this.props.onChange`) with a `{name, value}` object the way that `onInputChange()` expects, we're able to reuse that handler. When `onInputChange()` is called by `CourseSelect`, it can appropriately update `state` with the new department and course information.

```javascript
  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <Field
            placeholder="Name"
            name="name"
            value={this.state.fields.name}
            onChange={this.onInputChange}
            validate={val => (val ? false : 'Name Required')}
          />

          <br />

          <Field
            placeholder="Email"
            name="email"
            value={this.state.fields.email}
            onChange={this.onInputChange}
            validate={val => (isEmail(val) ? false : 'Invalid Email')}
          />

          <br />

          <CourseSelect
            department={this.state.fields.department}
            course={this.state.fields.course}
            onChange={this.onInputChange}
          />

          <br />

          <input type="submit" disabled={this.validate()} />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {this.state.people.map(({name, email, department, course}, i) => (
              <li key={i}>{[name, email, department, course].join(' - ')}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
```

When adding `CourseSelect` we provide three `props`:

1. The current department from `state`
2. The current course from `state`
3. The `onInputChange()` handler

The only thing left to do is add these fields to our form-level validation. Our `CourseSelect` controls the UI to ensure that we won't get invalid data, so we don't need to worry about field-level errors. However, department and course are required fields, we should make sure that they are present before allowing the user to submit. We do this by updating our `validate()` method to include them:

```javascript
validate = () => {
  const person = this.state.fields;
  const fieldErrors = this.state.fieldErrors;
  const errMessages = Object.keys(fieldErrors).filter((k) => fieldErrors[k]);

  if (!person.name) return true;
  if (!person.email) return true;
  if (!person.course) return true;
  if (!person.department) return true;
  if (errMessages.length) return true;

  return false;
};
```

<details>
  <summary>Separation of View and State</summary>

> Once we've received information from the user and we've decided that it's valid, we then need to convert the information to JavaScript objects. Depending on the form, this could involve casting input values from strings to numbers, dates, or booleans, or it could be more involved if you need to impose a hierarchy by corralling the values into arrays or nested objects. After we have the information as JavaScript objects, we then have to decide how to use them. The objects might be sent to a server as JSON to be stored in a database, encoded in a url to be used as a search query, or maybe only used to configure how the UI looks. The information in those objects will almost always affect the UI and in many cases will also affect your application's behavior. It's up to us to determine how to store that info in our app.

</details>

---

## Async Persistence

In most web apps, when a user inputs data, that data should be sent to a server for safe keeping in a database. When the user returns to the app, the data can be fetched, and the app can pick back up right where it left off. We won't be sending the data to a remote server or storing it in a database (we'll be using `localStorage` instead), we'll treat it as an asynchronous operation to illustrate how almost any persistence strategy could be used. To persist the sign up list (`state.people`), we'll only need to make a few changes to our parent form component. At a high level they are:

1. Modify `state` to keep track of persistence status. Basically, we'll want to know if the app is currently loading, is currently saving, or encountered an error during either operation.
2. Make a request using our API client to get any previously persisted data and load it into our `state`.
3. Update our `onFormSubmit()` event handler to trigger a save.
4. Change our `render()` method so that the "submit" button both reflects the current save status and prevents the user from performing an unwanted action like a double-save.

```javascript
state = {
  fields: {
    name: "",
    email: "",
    course: null,
    department: null,
  },
  fieldErrors: {},
  people: [],
  _loading: false,
  _saveStatus: "READY",
};
```

`_saveStatus` is initialized with the value `"READY"`, but we will have four possible values: `"READY"`, `"SAVING"`, `"SUCCESS"`, and `"ERROR"`. If the `_saveStatus` is either `"SAVING"` or `"SUCCESS"`, we'll want to prevent the user from making an additional save. When the component has been successfully loaded and is about to be added to the DOM, we'll want to request any previously saved data. To do this we'll add the lifecycle method `componentDidMount()` which is automatically called by React at the appropriate time. Here's what that looks like:

```javascript
componentDidMount() {
  this.setState({_loading: true});
  apiClient.loadPeople().then(people => {
    this.setState({_loading: false, people: people})
  })
}
```

Before we start the fetch with `apiClient`, we set `state._loading` to `true`. We'll use this in `render()` to show a loading indicator. Once the fetch returns, we update our `state.people` list with the previously persisted list and set `_loading` back to `false`. As in the previous sections, we'll want our user to be able to fill out each field and hit "submit" to add a person to the list. When they do that, `onFormSubmit()` is called. We'll make a change so that we not only perform the previous behavior, but we also persist that list using `apiClient.savePeople()`:

```javascript
onFormSubmit = (evt) => {
  const person = this.state.fields;

  evt.preventDefault();

  if (this.validate()) return;

  const people = [...this.state.people, person];

  this.setState({ _saveStatus: "SAVING" });
  apiClient
    .savePeople(people)
    .then(() => {
      this.setState({
        people: people,
        fields: {
          name: "",
          email: "",
          course: null,
          department: null,
        },
        _saveStatus: "SUCCESS",
      });
    })
    .catch((err) => {
      console.error(err);
      this.setState({ _saveStatus: "ERROR" });
    });
};
```

In the previous sections, if the data passed validation, we would just update our `state.people` list to include it. This time we'll also add the `person` to the `people` list, but we only want to update our `state` if `apiClient` can successfully persist. The order of operations looks like this:

1. Create a new array, `people` with both the contents of `state.people` and the new `person` object.
2. Update `state._saveStatus` to `"SAVING"`
3. Use `apiClient` to begin persisting the new `people` array from #1.
4. If `apiClient` is successful, update `state` with our new `people` array, an empty fields object, and `_saveStatus: "SUCCESS"`. If `apiClient` is not successful, leave everything as is, but set `state._saveStatus` to `"ERROR"`.

Our last change is to modify our render() method so that the UI accurately reflects our status with respect to loading and saving.

```javascript
  render() {
    if (this.state._loading) {
      return <img alt="loading" src="/img/loading.gif" />;
    }

    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <Field
            placeholder="Name"
            name="name"
            value={this.state.fields.name}
            onChange={this.onInputChange}
            validate={val => (val ? false : 'Name Required')}
          />

          <br />

          <Field
            placeholder="Email"
            name="email"
            value={this.state.fields.email}
            onChange={this.onInputChange}
            validate={val => (isEmail(val) ? false : 'Invalid Email')}
          />

          <br />

          <CourseSelect
            department={this.state.fields.department}
            course={this.state.fields.course}
            onChange={this.onInputChange}
          />

          <br />

          {
            {
              SAVING: <input value="Saving..." type="submit" disabled />,
              SUCCESS: <input value="Saved!" type="submit" disabled />,
              ERROR: (
                <input
                  value="Save Failed - Retry?"
                  type="submit"
                  disabled={this.validate()}
                />
              ),
              READY: (
                <input
                  value="Submit"
                  type="submit"
                  disabled={this.validate()}
                />
              )
            }[this.state._saveStatus]
          }
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {this.state.people.map(({name, email, department, course}, i) => (
              <li key={i}>{[name, email, department, course].join(' - ')}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
```

First, we want to show the user a loading indicator while we are loading previously persisted data. Like the previous section, this is done on the first line of `render()` with a conditional and an early return. Next, we want the submit button to communicate the current save status. If no save request is in-flight, we want the button to be enabled if the field data is valid. If we are in the process of saving, we want the button to read "Saving..." and to be disabled. The user will know that the app is busy, and since the button is disabled, they won't be able to submit duplicate save requests. If the save request resulted in an error, we use the button text to communicate that and indicate that they can try again. The button will be enabled if the input data is still valid. Finally, if the save request completed successfully, we use the button text to communicate that. Here's how we render the button:

```javascript
  {{
    SAVING: <input value='Saving...' type='submit' disabled />,
    SUCCESS: <input value='Saved!' type='submit' disabled/>,
    ERROR: <input value='Save Failed - Retry?' type='submit' disabled={this.validate()}/>,
    READY: <input value='Submit' type='submit' disabled={this.validate()}/>
  }[this.state._saveStatus]}
```

What we have here are four different buttons -- one for each possible `state._saveStatus`. Each button is the value of an object keyed by its corresponding status. By accessing the key of the current save status, this expression will evaluate to the appropriate button. The last thing that we have to do is related to the `"SUCCESS"` case. We want to show the user that the addition was a success, and we do that by changing the text of the button. However, "Saved!" is not a call to action. If the user enters another person's information and wants to add it to the list, our button would still say "Saved!". It should say "Submit" to more accurately reflect its purpose. The easy fix for this is to change our `state._saveStatus` back to `"READY"` as soon as they start entering information again. To do this, we update our `onInputChange()` handler

```javascript
onInputChange = ({ name, value, error }) => {
  const fields = this.state.fields;
  const fieldErrors = this.state.fieldErrors;

  fields[name] = value;
  fieldErrors[name] = error;

  this.setState({ fields, fieldErrors, _saveStatus: "READY" });
};
```

[^1]: [SyntheticEvent](https://reactjs.org/docs/events.html)
[^2]: [Validator](https://www.npmjs.com/package/validator)
[^3]: [NodeSchool](https://nodeschool.io/)
