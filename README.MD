# Unit Testing :test_tube:

## Table of contents

1. [Unit Testing](#unit-testing)
2. [Creating a Node.js Project](#creating-a-nodejs-project)
3. [Installing Jest](#installing-jest)
4. [Writing the First Test](#writing-the-first-test)
5. [React Test Setup](#react-test-setup)
6. [Testing React Components](#testing-react-components)
      - [Testing the Structure of a Component](#testing-the-structure-of-a-component)
      - [Testing Interaction with a Component](#testing-interaction-with-a-component)

---

## Unit Testing

The preferred way to run unit-tests for React applications is a **command-line tool called Jest**. It lets us test React components, how they render and the interaction with them. It is pZossible to run parts of Jest inside the browser when swiching to a test-runner like Mocha. With this setup, only rendering of components can be tested, but not the interaction with them.

---

## Creating a Node.js Project

While Jest is easy to set up, it needs to run in Node.js. To create a new Node.js project, we need to create an empty directory and run `npm init` inside of it. This command will ask a few questions; the answers will be included in the `package.json` it creates. For `test command:` we enter `jest` but it won't be installed yet.


---

## Installing Jest

Install Jest with: 

```shell
npm install jest --save-dev
```

This command changes the `package.json` by adding a new entry for Jest inside `devDependencies`. It also create a lock-file, a `node_modules` directory, and download Jest and all of Jest's dependencies into this new directory
We can now run Jest with `npm test`

---

## Writing the First Test

To write our first test, we need to create a test file. Jest looks inside all directories, besides `node_modules` for files called `*.test.js` and try to run the tests inside them.

```javascript
describe("Test", function () {
  it("runs", function () {
    expect(true).toBe(true);
  });
});
```

The `describe()` function takes a description and a callback. The callback will be filled with calls to the `it()` function, which also takes a description and a callback.
Running the test with `npm test` would generate an output like this:

```shell
 PASS  ./react.test.js
  Test
    ✓ runs (1 ms)
```

--- 

## React Test Setup

Jest is now set up for basic testing, but we need some additional package to test our React components. First, we need to include React. Second, we need the `react-test-renderer` package. Which will have the effect of creating a "DOM" we're running in Node.js. We also have to install the Babel compiler, because we want to use JSX.
All can be installed with: 

```shell
npm install react babel-jest babel-preset-env babel-preset-react react-test-renderer --save-dev
```

Babel is pre-configured right when running in the browser, but we need to add a configuration file when running it via Jest. The file has to be named `.babelrc` and has to have the following content:

```javascript
{
   "presets": [
       "@babel/react" , 
       "@babel/env" , 
   ],
   "plugins": [
       "@babel/plugin-proposal-class-properties"
   ]
}
```

>Another convenient way to setup a new React project with Jest is `create-react-app` [^1] While it is a typical way to create a React app, it also includes a lot of other features.

---

## Testing React Components

After we have Jest up and running, we can finally start testing our React components.

### Testing the Structure of a Component

```javascript
let React = require("react");
function MyComponent(props) {
  return <span>Hello, World!</span>;
}
module.exports = MyComponent;
```

First we need to require React, because JSX makes calls to the `React.createElement()` function. Then we define a simple component and export it, so a `MyComponent.test.js` file can require it. The test file needs to look as follows:

```javascript
let React = require("react");
let renderer = require("react-test-renderer");
let MyComponent = require("./MyComponent");

describe("MyComponent", function () {
  it("renders hello world", function () {
    let result = renderer.create(<MyComponent />).toJSON();
    expect(result.children[0]).toBe("Hello, World!");
  });
});
```

Because we use JSX in out test definition, we need to require React here too. The test renderer is needed instead of React-DOM because no DOM is available in Node.js. Finally, we need the component we want to test since we exported it in `MyComponent.js`, we can now require it in our test file. In the test, we use the test renderer to get a JSON representation of our component. First, we call the `create()` method to enter the JSX we want to render, then we call the `toJSON()` to get a JavaScript object we can check. Jest gives us a global `expect()` function we can use to test for different outcomes. The only check our test performs is to look inside the `children` of our `result` object and expect it to be "Hello, World!".
If we rerun Jest with `npm test` the result should look something like this:

```shell
 PASS  ./MyComponent.test.js (12.51 s)
  MyComponent
    ✓ renders hello world (6 ms)
```

### Testing Interaction with a Component

Testing the structural integrity of our components is only one of the ways we can test components. We also want to test if interactions with our components work. To do this, we need to test if event-handlers we pass into the `props` of our components get called at the right moments. Jest offers a global method called `fn()` for this. It creates a function that keeps track of many things, like how often it was called.

```javascript
let React = require("react");
function MyButton(props) {
  return <button onClick={props.onButtonPress}>Click Me!</button>;
}
module.exports = MyButton;
```

The component only wraps a `<button>` element and passes its `onButtonPress` prop into the buttons `onClick` prop. Now we need a test for it, let's write it inside the `MyButton.test.js`:

```javascript
let React = require("react");
let renderer = require("react-test-renderer");
let MyButton = require("./MyButton");

describe("MyButton", function () {
  it("calls function on click", function () {
    let callback = jest.fn();
    let result = renderer
      .create(<MyButton onButtonPress={callback} />)
      .toJSON();
    result.props.onClick();
    expect(callback.mock.calls.length).toBe(1);
  });
});
```
 
This time we don't check the structure, we check how often the `callback` was called. We pass it into the `onButtonPress` prop of our component and then render evetything with the help of the test renderer. The result should have the `callback` we passed inside the `onClick` prop of the rendered `<button>` element we created inside out `MyButton` component. We call `onClick` once and check if the `callback`'s `calls.length` is `1` now.

```shell
 PASS  ./MyButton.test.js (9.251 s)
  MyButton
    ✓ calls function on click (6 ms)
Test Suites: 1 passed, 1 total  
```



[^1]: [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html)