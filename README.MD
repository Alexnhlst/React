# Advanced Component Configuration

## Table of contents

1. [Introduction](#introduction)
2. [render()](#render)
3. [props](#props)
4. [PropTypes](#proptypes)
5. [Context](#context)
6. [state](#state)
7. [Stateful components](#stateful-components)
8. [Stateless components](#stateless-components)
9. [props.children](#propschildren)

---

## Introduction

A `ReactComponent` is a JavaScript object that, at a minimum, has a `render()` function. `render()` is expected to return a `ReactElement`. The goal of a `ReactComponent` is to:

- `render()` a `ReactElement` (which will eventually become thee real DOM) Advanced
- attach functionality to this section of the page

---

## render()

There are two ways to define a `ReactComponent` instance:

1. ES6 classes
2. Function components

```javascript
import React from "react";

class ComponentApp extends React.Component {
  render() {
    return <div />;
  }
}

export default ComponentApp;
```

```javascript
const FunctionComponent = (props) => {
  return <div />;
};

export default FunctionComponent;
```

When defining a class component, React expects a `render()` function. When using a function component, the function itself is just the `render()` function
The `render()` method is the only required method to be defined on a `ReactComponent`. After the component is mounted and initialized, `render()` will be called. It's job is to provide React a virtual representation of a native DOM component. React expects the method to return a single child element. It can be a virtual representation of a DOM component or can return the falsy value of `null` or `false`. React handles the falsy value by rendering an empy element (a `<noscript />` tag.) This is used to remove the tag from the page. Keeping the `render()` method side-effect free provides an important optimization and makes our code easier to understand.
While `render` is the only required method, it isn't very interesting if the only data we can render is known at compile time. We need a way to:

- input arguments into our components
- maintain state within a component

React provides ways to do both of these things, with `props` and `state`. In React, `props` are immutable pieces of data that are passed into child components from parents. `state` is where we hold data, local to a component. Typically, when our component's `state` changes, the component needs to be re-rendered. Unlike `props`, `state` is private to a component and is mutable.

---

## props

`props` are the inputs to your components. If we think of our component as a function, we can think of the props as the arguments.

```javascript
<div>
  <Header headerText="Hello world" />
</div>
```

We're creating both a `<div>` and a `<Header>` element, where the `<div>` is a usual DOM element, while `<Header>` is an instance of our `Header` component. We're passing data from the component through the attribute `headerText` to the component.

> Passing data through attributes to the component is often called passing props

When we pass data to a component through an attribute it becomes available to the component through the `this.props` property.

```javascript
import React from "react";

export class Header extends React.Component {
  render() {
    return <h1>{this.props.headerText}</h1>;
  }
}
```

While we can access the `headerText` property, we cannot change it. By using `props` we've taken our static component and allowed it to dynamically render whatever `headerText` is passed into it. We can pass any JavaScript object through props. We can pass primitives, simple JavaScript objects, atoms, functions etc. We can even pass other React elements and Virtual DOM nodes.

---

### PropTypes

`PropTypes` are a way to validate the values that are passed in through `props`. Well-defined interfaces provide us with a layer of safety at the run time of our apps. They also provide a layer of documentation to the consumer of our components. We include the `prop-types` package in our `package.json`. We define `PropTypes` by setting a static (class) property `propTypes`. This object should be a map of prop-name to `PropTypes` values:

```javascript
class MapComponent extends React.Component {
  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    zoom: PropTypes.number,
    place: PropTypes.object,
    markers: PropTypes.array,
  };
}
```

There are a number of built-in `PropTypes`, and we can define our own. There are validators for scalar types:

- `string`
- `number`
- `boolean`

We can also validate complex types such as:

- `function`
- `object`
- `array`
- `arrayOf` - expects an array of a particular type
- `node`
- `element`

We can also validate a particular `shape` of an input object, or validate that it is an `instanceOf` a particular class. Sometimes we want our `props` to have defaults. We can use the static property `defaultProps` to do this.

```javascript
class Counter extends React.Component {
  static defaultProps = {
    initialValue: 1,
  };
}
```

---

## Context

Sometimes we might find that we have a prop which we want to expose "globally". In this case, we might find it cumbersome to pass this particular prop down from the root, to every leaf, through every intermediate component. Starting in React 16.3.0, React adds a new API that allows us to specify variables we want to carry downwards through the component tree, rather than needing to pass down variables manually through component parent to child. In order to tell React we want to pass a `context` "global" variable down, we need to specify it using the context API. When we specify a `context`, React will take care of passing down `context` from component to component so that at any point in the tree hierarchy, any component can reach up to the "global" context where it's defined and get access to the parent's variables. In order to tell React we want to pass a variable through the context, we'll need to define a context to pass down through. We can do this by first defining a context `Provider`/`Consumer` context using the `React.createContext()` method. We'll then pass the context down through the react tree using the content's `Provider` component which specifically is designed for passing through contexts. We can access the context from the `Provider` by using the `Consumer` component as a child of the `Provider` element.

```javascript
import React from "react";
export const ThemeContext = React.createContext(themes.dark);
```

The `React.createContext()` method accepts a single argument which is the default value the context provides. Now that we have the `ThemeContext`, we'll want to provide this theme down to child components. With the `ThemeContext` created, we can use the `Provider` component to pass down the theme.

```javascript
class App extends Component {
    state = {theme: themes.dark};
    render() {
        return(
            <div className="App">
                <ThemeContext.Provider value={this.state.theme}>
                    <Header />
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                    <button onClick={this.changeTheme}>Change theme</button>
                </ThemeContext.provider>
            </div>
        )
    }
}
```

Passing down the theme through the `ThemeContext.Provider` allows us to pluck the theme from components lower down. We are passing the `value` prop in the ThemeContext.Provider component. Without this `value` prop, children components cannot access the value of the provider. The `ThemeContext.Provider` component is a special component that is specifically designed to only pass down data to child components. In order to consume the value of the context, we'll need to use a different component exported by the `ThemeContext`.

```javascript
// Header.js
import { ThemeContext } from "./theme";

export const Header = (props) => (
  <ThemeContext.Consumer>
    {(theme) => (
      <header
        className="App-header"
        style={{ backgroundColor: theme.background }}
      >
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title" style={{ color: theme.foreground }}>
          Welcome to React
        </h1>
      </header>
    )}
  </ThemeContext.Consumer>
);
```

The usage of the `Consumer` component might look a bit different than what we are used to where the child is a method that passes the value of the `Provider` as an argument to the method. Using this method, we have access to the passed down prop.

```javascript
import React from "react";
export const ThemeContext = React.createContext(themes.dark);
```

The default value is used within the consumer in the case that the child component is not wrapped in a `ThemeContext.Provider` component.
It's possible to wrap multiple context providers in our application just as normal. In fact, we don't have to do anything special. We can simply wrap our components in multiple context Provider components.

```javascript
// user.js
import React from "react";
export const UserContext = React.createContext(null);

// Body.js
import { UserContext } from "./user";

export const Body = (props) => (
  <ThemeContext.Consumer>
    {(theme) => (
      <header
        className="App-header"
        style={{ backgroundColor: theme.background }}
      >
        <UserContext.Consumer>
          <h1>{(user) => (user ? "Welcome back" : "Welcome")}</h1>
        </UserContext.Consumer>
      </header>
    )}
  </ThemeContext.Consumer>
);
```

The `Consumer` component must be derived from the created context. Without this, the value won't be passed on down. For this reason, we create the context and export it from a file. Otherwise the value won't have an effect.

---

## state

To know when to apply state, we need to understand the concept of stateful components. Any time a component needs to hold on to a dynamic piece of data, that component can be considered stateful. It's a good idea to have as few stateful components as possible. This is because state introduces complexity and makes composing components more difficult.

```javascript
const CREDITCARD = "CreditCard";
const BTC = "Bitcoin";

class Switch extends React.Component {
  state = {
    payMethod: BTC,
  };

  render() {
    return (
      <div className="switch">
        <div className="choice">CreditCard</div>
        <div className="choice">Bitcoin</div>
        Pay with: {this.state.payMethod}
      </div>
    );
  }
}
```

The `Switch` component is stateful as it's keeping track of the user's preferred method of payment. Our payment switch isn't yet interactive; we cannot change the state of the component. In order to add interaction, we'll want to respond to a click event. To add a callback handler to any component, we can use the `onClick` attribute on a component. The `onClick` handler will be fired anytime the component it's defined on is clicked

```javascript
render() {
    return (
      <div className="switch">
        <div
            className="choice"
            onClick={this.select(CREDITCARD)}
        >
            CreditCard
        </div>
        <div
            className="choice"
            onClick={this.select(BTC)}
        >
            Bitcoin
        </div>
        Pay with: {this.state.payMethod}
      </div>
    );
  }
}
```

We've attached a callback handler that will be called every time either one of the `<div>` elements are clicked. It expects to receive a function that it will call when the click event occurs

```javascript
select = (choice) => {
  return (evt) => {
    // handler starts here
    this.setState({
      payMethod: choice,
    });
  };
};
```

The `select` function will return a function. This is a common pattern for passing arguments to handlers. We close over the `choice` argument when we call `select`. `select` returns a new function that will call `setState` with the appropriate `choice`. `select` is actually called during `render`, and it's the return value of `select` tha gets called `onClick`. When the handler function is called, the component will call `setState` on itself. Calling `setState` triggers a refresh, which means the `render` function will be called again, and we'll be able to see the current `state.payMethod` in our view.

> Since the `setState` method triggers a refresh, we want to be careful about how often we call it. Modifying the actual-DOM is slow so we don't want to cause a cascade of `setState`s to be called, as that could result in poor performance

---

## Stateful components

Defining state on our component requires us to set an instance variable called `this.state` in the object prototype class. In order to do this, it requires us to set the state in on of two places, either as a property of the class or in the constuctor. Setting up a stateful component in this way:

1. Allows us to define the initial state of our component
2. Tells React that our component will be stateful. Without this method defined, our component will be considered to be stateless.

```javascript
class InitialStateComponent extends React.Component {
    constuctor(props) {
        super(props);

        this.state = {
            currentValue: 1,
            currentUser: {
                name: "Ari
            }
        }
    }
}
```

Setting `props` inside of our component is always a bad idea. Setting the initial value of the `state` property is the only time we should ever use props when dealing with a component's state. If we have a component where the `prop` indicates a `value` of the component, we should apply that value to the `state` in the `constuctor()` method. A better name for the value as a prop is `initialValue`, indicating that the initial state of the value will be set.

```javascript
// CounterWrapper.js
const CounterWrapper = (props) => (
    <div key="counterWrapper">
        <Counter initialValue={125} />
    </div>>
)

// Counter.js
class Counter extends Component {
  constuctor(props) {
    super(props);

    this.state = {
      value: this.props.initialValue,
    };

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }
}
```

Whenever a state update depends on the current state, it is preferable to pass a function to `setState()` because it is asynchronous.[^1}]

```javascript
decrement = () => {
  this.setState((prevState) => {
    return {
      value: prevState.value - 1,
    };
  });
};
```

<details>
    <summary>Thinking about state</summary>

> Spreading state throughout our app can make it difficult to reason about. When building stateful components, we should be mindful about what we put in state and why we're using state. Generally, we want to minimize the number of components in our apps that keep component-local state. If we have a component that has UI states which:
>
> 1.  cannot be fetched from outside or
> 2.  cannot be passed onto the component
>
> that's usually a case for building state into the component. However, any data that can be passed in through `props` or by other components is usually best to leave untouched. The only information we should ever put in state are values that are not computed and do not need to be sync'd across the app.
>
> > The decision to put state in our components or not is deeply related to the tension between object-oriented programming and functional programming. In functional programming, if you have a pure function, then calling the same function, with the same arguments, will always return the same value for a given set of inputs. In object-oriented programming you have objects which hold on to state within that object. The object state then becomes implicit parameters to the methods on the object. The state can change and so calling the same function, with the same arguments, at different times in your program can return different answers. This is related to `props` and `state` in React components because you can think of `props` as arguments to our component and state as instance variables to an object. If our component uses only `props` for configuring a component (and it does not use `state` or any other outside variables) then we can easily predict how a particular component will render. However, if we use mutable, component-local state then it becomes more difficult to understand what a component will render at a particular time. So while carrying implicit arguments through state can be convenient, it can also make the system difficult to reason about.

</details>

One way that we can mitigate and minimize the complex states is by building our apps with a single stateful component composed of stateless components.

---

## Stateless components

Stateless components are intended to be lightweight components that do not need any special handling around the component. They only need the `render()` method. We won't reference `this` when working with functional, stateless components. They are just functions and do not have a backing instance. These components cannot contain state and do not het called with the normal component lifecycle methods. React does allow us to use `propTypes` and `defaultProps` on stateless components. Stateful components often spread complexity throughout a system. Using stateless components where possible can help contain the state in fewer locations. This makes our programs easier to reason about. Using functional components can have performance benefits. There's less "ceremony" around component setup and tear-down. The React core team has mentioned that more performance improvements may be introduced for functional components in the future.

In our `Switch` component we pulled each choice out into the `renderChoice` function. This indicates that this is a good candidate for pulling into its own stateless component. `renderChoice` is the function that calls `select`, which means that it indirectly is the function that calls `setState`

```javascript
const Choice = ({ active, onClick, label }) => {
  const cssClasses = ["choice"];

  if (active) {
    // check props, not state
    cssClasses.push("active");
  }

  return (
    <div className={cssClasses.join(" ")} onClick={onClick}>
      {label}
    </div>
  );
};
```

We've created a `Choice` function which is a stateless component. In `Choice` we make three changes:

1. We determine if this choice is the active one by reading `active`
2. When a `Choice` is clicked, we call whatever function that is on `onClick`
3. The label is determined by `label`

All of these changes mean that `Choice` is decoupled from the `Switch` statement. We could now conceivably use `Choice` anywhere, as long as we pass `active`, `onClick`, and `label` through the props.

```javascript
// Switch
class Switch extends React.Component {
  state = {
    payMethod: BTC,
  };

  select = (choice) => {
    return (evt) => {
      this.setState({
        payMethod: choice,
      });
    };
  };

  render() {
    return (
      <div className="switch">
        <Choice
          onClick={this.select(CREDITCARD)}
          active={this.state.payMethod === CREDITCARD}
          label="Pay with Creditcard"
        />
        <Choice
          onClick={this.select(BTC)}
          active={this.state.payMethod === BTC}
          label="Pay with Bitcoin"
        />
        Paying with: {this.state.payMethod}
      </div>
    );
  }
}
```

Here we're using our `Choice` component and passing the three props (parameters) `active`, `onClick`, and `label`. What's neat about this is that we could easily:

1. Change what happens when we click this choice by changing the input to `onClick`
2. Change the condition by which a particular choice is considered active by changing the `active` prop
3. Change what the label is to any arbitrary string

By creating a stateless component `Choice` we're able to make `Choice` reusable and not be tied to any particular state.

---

## props.children

While we generally specify `props` ourselves, React provides some special `props` for us. In our components, we can refer to child components in the tree using `this.props.children`.

```javascript
<Container>const Newspaper = props => {
    return (
        <Container>
            <Article headline="An interesting Article">
                Content here
            </Article>
        </Container>
    )
}
```

The `Container` component contains a single child, the `Article` component. How many children the `Article` component contain? It contains a single child, the text `Content here`. In the `Container` component, say that we want to add markup around whatever the `Article` component renders. To do this, we write our JSX in the `Container` component, and then place `this.props.children`

```javascript
class Container extends React.Component {
  render() {
    return <div className="container">{this.props.children}</div>;
  }
}
```

The Container component above will create a `div` with `class='container'` and the children of this React tree will render within that `div`. Generally, React will pass the `this.props.children` prop as a list of components if there are multiple children, whereas it will pass a single element if there is only one component.

It can become cumbersome to check what type our `children` props is every time we want to use `children` in a component.

```javascript
class DocumentedContainer extends React.Component {
  static propTypes = {
    children: PropTypes.oneOf([PropTypes.element, PropTypes.array]),
  };
  render() {
    return <div className="container">{this.props.children}</div>;
  }
}
```

We can handle this a few different ways:

1. Requre `children` to be a single child every time (e.g., wrap our children in their own element)
2. Use the `Children` helper provided by React

```javascript
class SingleChildContainer extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };
  render() {
    return <div className="container">{this.props.children}</div>;
  }
}
```

The `React.Children` utility helper is used for dealing with the child components. The most common operation we'll use on children is mapping over the list of them. We'll often use a `map` to call `React.cloneElement()` or `React.createElement()` along the children.

```javascript
class MultiChildContainer extends React.Component {
  static propTypes = {
    component: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
  };
  renderChild = (children, index) => {
    return React.createElement(
      this.props.component,
      {}, // child props
      childData // child's children
    );
  };
  render() {
    return (
      <div className="container">
        {React.Children.map(this.props.children, this.renderChild)}
      </div>
    );
  }
}
```

`props.children` returns a data structure that can be tricky to work with. Often when dealing with children, we'll want to convert our `props.children` object into a regular array. `React.Children.toArray()` converts the `props.children` data structure into an array of the children.

```javascript
class ArrayContainer extends React.Component {
  static propTypes = {
    component: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
  };
  render() {
    const arr = React.Children.toArray(this.props.children);

    return <div className="container">{arr.sort((a, b) => a.id < b.id)}</div>;
  }
}
```

[^1]: [Using a function in `setState`](https://medium.com/@wisecobbler/using-a-function-in-setstate-instead-of-an-object-1f5cfd6e55d1)
