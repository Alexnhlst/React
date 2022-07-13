# First React App

## Table of contents

1. [Prepare the app](#prepare-the-app)
2. [What's a component?](#whats-a-component)
3. [JSX](#jsx)
4. [Babel](#babel)
5. [ReactDOM.render()](#reactdomrender)
6. [Product component](#product-component)
7. [Props](#props)

---

## Prepare the app

To prepare the app, first we need to use `npm install` to install dependencies, then `npm start` to start the app. It will be availabe at the URL `http://localhost:3000`.
When we ran `npm install`, npm used our `package.json` to determine what dependencies to download and install (installed in the folder `node_modules`)
The code we'll be working with is inside the folder `public/`. Inside this folder there is `index.html`, which is the centerpiece of our app and loads in the rest of our app's assets. The dependencies are being loaded under the `<head>` tag.

```html
<head>
  <meta charset="utf-8" />
  <title>Project One</title>
  <link rel="stylesheet" href="./semantic-dist/semantic.css" />
  <link rel="stylesheet" href="./style.css" />
  <script src="vendor/babel-standalone.js"></script>
  <script src="vendor/react.js"></script>
  <script src="vendor/react-dom.js"></script>
</head>
```

> For this project, we're using Semantic UI[^1]. It is a CSS framework that provides us with a grid sysyem and some simple styling.

---

## What's a component?

Building a React app is all about components. An individual component can be thought of as a UI component in an app.Not only do React components map cleanly to UI components, but they are selfcontained. The markup, view logic, and often component-specific style is all housed in one place. This feature makes React components reusable

```javascript
class ProductList extends React.Component {
  render() {
    return (
      <div className="ui unstackable items">
        Hello, friend! I am a basic React component.
      </div>
    );
  }
}
```

React components are ES6 classes that extend the class `React.Component`. `render()` is the only required method for a React component. React uses the return value from this method to determine what to render to the page. The syntax of the return value is JSX (JavaScript eXtension syntax)

---

## JSX

React components ultimately render HTML which is displayed in the browser. As such, the `render()` method of a component needs to describe how the view should be represented as HTML. React builds our apps with a fake representation of the DOM, it calls this the _virtual DOM_. JSX was created to make this JavaScript representation of HTML more HTML-like. JSX presents a light abstraction over the JavaScript version, yet the legibility benefits are huge. Readability boosts our app’s longevity and makes it easier to onboard new developers.

```javascript
React.createElement("div", {className: "ui items},
    React.createElement("p", null, "Hello, friend! I am a basic React component.")
)
```

in JSX:

```HTML
<div className="ui items">
    <p>
        Hello, friend! I am a basic React component.
    </p>
</div>
```

---

## Babel

Most browsers in use today do not fully support ES6. Babel is a JavaScript transpiler, it turns ES6 code into ES5 code. We call this process transpiling. Another handy feature of Babel is that it understands JSX. Babel compiles our JSX into vanilla ES5 JS that our browser can then interpret and execute. We just need to instruct the browser that we want to use Babel to compile and run our JavaScript code. All we need to do is tell our JavaScript runtime that our code should be compiled by Babel. We can do this by setting the `type` attribute when we import the script in `index.html` to `text/babel`.

```html
<script
  type="text/babel"
  data-plugins="transform-class-properties"
  src="./js/app.js"
></script>
```

---

## ReactDOM.render()

We need to instruct React to render the `ProductList` component inside a specific DOM node.

```javascript
class ProductList extends React.Component {
  render() {
    return (
      <div className="ui unstackable items">
        Hello, friend! I am a basic React component.
      </div>
    );
  }
}

ReactDOM.render(<ProductList />, document.getElementById("content"));
```

`ReactDOM` is from the `react-dom` library that we also include in `index.html`. We pass in two arguments to the `ReactDOM.render()` method:

```javascript
ReactDOM.render([what], [where]);
```

For the "what" we're passing in a reference to our React component `ProductList` in JSX. For the "where", we pass in a reference to the DOM node.
In React, native HTML elements always start with a lowercase letter whereas React component names always start with an uppercase letter.

---

## Product component

```javascript
class Product extends React.Component {
  render() {
    return (
      <div className="item">
        <div className="image">
          <img src="images/products/image-aqua.png" />
        </div>
        <div className="middle aligned content">
          <div className="description">
            <a>Fort Knight</a>
            <p>Authentic renaissance actors, delivered in just two weeks</p>
          </div>
          <div className="extra">
            <span>Submitted by:</span>
            <img className="ui avatar image" src="images/avatars/daniel.jpg" />
          </div>
        </div>
      </div>
    );
  }
}
```

At the moment, the `Product` component is static with hard-coded values. To use this component in a meaningful way, we'll want to change it to be data-driven and therefore dynamic. Driving the `Product` component with data will allow us to dynamically render the component based upon the data that we give it.
`seed.js` contains some example data for our products (it will "seed" or app's data). Each product has a unique `id` and a handful of properties.

---

## Props

We want to modify our `Product` component so that it no longer uses static, hard-coded attributes. Instead, we want it to be able to accept data passed down from its parent, `ProductList`. Setting up our component structure in this way enables our `ProductList` component to dynamically render any number of `Product` components that each have their own unique attributes. Data flow will look like this:

```mermaid
flowchart TD
    A[seed.js] --> B[Product list]
    B --> C[Product]
    B --> D[Product]
    B --> E[Product]
    B --> F[Product]
```

The way data flows from parent to child in React is through props. When a parent renders a child, it can send along props the child depens on.

```javascript
class ProductList extends React.Component {
  render() {
    const product = Seed.products[0];
    return (
      <div className="ui unstackable items">
        <Product
          id={product.id}
          title={product.title}
          description={product.description}
          url={product.url}
          votes={product.votes}
          submitterAvatarUrl={product.submitterAvatarUrl}
          productImageUrl={product.productImageUrl}
        />
      </div>
    );
  }
}
```

The `product` variable is set to a JavaScript object that describes the first of our products. We pass the product's attributes along individually `Product` component using the syntax `[propName]=[propValue]`. In JSX, braces are a delimiter, signaling to JSX that what resides in-between the braces is a JavaScript expression. The other delimiter is using quotes for strings.

> JSX attribute values must be delimited by either braces or quotes. If type is important and we want to pass in something like a Number or `null`, use braces

In React, a component can access all its props through the object `this.props`. Inside of `Product`, the `this.props` object will look like this:

```json
{
  "id": 1,
  "title": "Yellow Pail",
  "description": "On-demand sand castle construction expertise.",
  "url": "#",
  "votes": 41,
  "submitterAvatarURL": "images/avatars/daniel.jpg",
  "productImageUrl": "images/products/image-aqua.png"
}
```

[^1]: [Semantic UI](https://semantic-ui.com/)
