# JSX and the Virtual DOM

## Table of contents

1. [Virtual DOM](#virtual-dom)
2. [Virtual DOM Pieces](#virtual-dom-pieces)
3. [JSX](#jsx)
4. [JSX Gotchas](#jsx-gotchas)

---

## Virtual DOM

React works differently than many earlier front-end JavaScript frameworks in that instead of working with the browser's DOM, it builds a virtual representation of the DOM.
When we do "classic-"style web development, we would typically:

1. locate an element (using `document.querySelector` or `document.getElementById`) and then
2. modify the element directly (say, by calling `.innerHTML()` on the element)

This style of development is problematic in that:

- It's hard to keep track of changes - it can become difficult keep track of current (and prior) state of the DOM to manipulate it into the form we need
- It can be slow - modifying the actual-DOM is a costly operation, and modifying the DOM on every change can cause poor performance

The Virtual DOM was created to deal with these issues. It is a tree of JavaScript objects that represents the actual DOM. When using it we code as if we're recreating the entire DOM on every update. The idea of re-creating the entire DOM results in an easy-to-comprehend development model: instead of the developer keeping track of all DOM state changes, the developer simply returns the DOM they wish to see. React takes care of the transformation behind the scenes.
The Virtual DOM will:

- use efficient diffing algorithms, in order to know what changed
- update subtrees of the DOM simultaneously
- batch updates to the DOM

<details>
    <summary>Virtual DOM vs. Shadow DOM</summary>

> The Shadow DOM is a form of encapsulation on our elements. Think about using the `<video>` tag in a browser. The browser will create a set of video controls such as a play button, a timecode number, a scrubbler progress bar etc. These elements aren't part of the "regular DOM" [^1]

</details>

---

## Virtual DOM Pieces

React's Virtual DOM is a tree of `ReactElements`. A `ReactElement` is a representation of a DOM element in the Virtual DOM. To create a `ReactElment`, we use the `createElement` provided by React:

```javascript
let boldElement = React.createElement("b");
```

Typing the code in the browser console will create an instance a `ReactElement`

```JSON
{
    "$$typeof": "Symbol(react.element)",
    "type": "b",
    "key": null,
    "ref": null,
    "props": {},
    "_owner": null,
    "_store": {}
}
```

Our `boldElment` is an instance of a `ReactElement` but it's not visible without giving it to React to render in the actual DOM tree. In order to render this element to the actual DOM tree we need to use `ReactDOM.render()`, it requires two things:

1. The root of our virtual tree
2. the mount location where we want React write to the actual browser DOM

```javascript
let mountElement = document.getElementById("root");
// This syntax is also valid
// let mountElement = document.querySelector("#root");

ReactDOM.render(boldElement, mountElement);
```

The element has been inserted into the document as a child of the `mountElement`. We now have a `b` tag in our DOM, it would be nice if we could add some text in the tag. Because text is in-between the opening and closing `b` tags, adding text is a matter of creating a child of the element.
`React.createElement()` accepts three arguments:

1. The DOM element type
2. The element `props`
3. The children of the element

The `children` of the DOM element must be a `ReactNode` object, which is any of the following:

1. `ReactElement`
2. A string or a number (a `ReactText` object)
3. An array of `ReactNodes`

```javascript
let mountElement = document.querySelector("#root");
let boldElement = React.createElement("b", null, "Text (as a string)");
ReactDOM.render(boldElement, mountElement);
```

React, using it's own virtual representation of the view-tree, can render this tree in multiple types of canvases. It can also be used to render views in other frameworks such as mobile apps. In React Native, this tree is rendered into native mobile views. We can call the `ReactDOM.render()` function multiple times and it will only perform updates (mutations) to the DOM as necessary. The `ReactDOM.render` function accepts a 3rd argument, a callback argument that is executed after the component is rendered/updated.

---

## JSX

To describe pages to our browser we write HTML; the HTML is parsed by the browser to create HTML Elements which become the DOM. HTML works very well for specifying tag hierarchies. It would be nice to represent our React component tree using markup, muck like we do for HTML. This is the idea behind JSX. Instead of calling `React.createElement` for each element, the equivalent structure in JSX is:

```javascript
let boldElement = <b>Text (as a string)</b>;
```

JSX stands for JavaScript Syntax Extension, and it is a syntax React provides that looks a lot like HTML/XML. Rather than building our component trees using normal JavaScript directly, we write our components almost as if we were writing HTML. One difference between React components and HTML tags is in the naming. HTML tags start with a lowercase letter, while React components start with an uppercase. JSX is transformed into JavaScript by using a pre-processor build-tool before we load it with the browser. When we write JSX, we pass it through a "compiler" that converts the JSX to JavaScript. The most common tool for this is a plugin to `babel`JSX provides another advantage: we can mix JavaScript with our JSX markup.

In order to use a JavaScript expression in a component's attribute, we wrap it in curly braces:

```javascript
const warningLevel = "debug";
const component = (<Alert
                    color={warningLevel === "debug" ? "gray" : "red}
                    log={true} />)
```

Another common pattern is to use a boolean checking expression and then render another element conditionally

```javascript
const renderAdminMenu = function () {
  return <MenuLink to="/users">User accounts</MenuLink>;
};

const userLevel = this.props.userLevel;
return (
  <ul>
    <li>Menu</li>
    {userLevel === "admin" && renderAdminMenu()}
  </ul>
);
```

In HTML, the presence of some attributes sets the attribute to true. For instance, a disabled `<input>` HTML element can be defined:

```HTML
<input name="Name" disabled />
```

In React we need to set these as booleans

```javascript
<input name="Name" disabled={true}>
```

We can define comments inside of JSX by using the curly braces with comment delimiters

```javascript
let userLevel = "admin";
{
  /*
    Show the admin menu if the userLevel is "admin"
*/
}
{
  userLevel === "admin" && <AdminMenu />;
}
```

Sometimes when we have many props to pass to a component, it can be cumbersome to list each one individually. We can use the JSX spread syntax:

```javascript
<Component {...props} />;
{
  /* essentially the same as this */
}
<Component msg={"Hello"} recipient={"World"} />;
```

---

## JSX Gotchas

When we want to set the CSS class of an HTML element, we normally use the `class` attribute in the tag

```HTML
<div class="box"></div>
```

Since JSX is so closely tied to JavaScript, we cannot use identifiers that JavaScript uses in our tag attributes. Attributes such as `for` and `class` conflict with the JavaScript keywords. JSX uses `className`:

```javascript
<div className="box"></div>
```

To pass multiple classes in JSX, we can join an array to convert it to a string:

```javascript
let cssNames = ["box", "alert"];
(<div className={cssNames.join(" ")}></div>>)
```

The `classnames` npm package[^2] is a great extension that we use to help manage css classes. It can take a list of strings or objects and allows us to conditionally apply classes to an element. The `classnames` package takes the arguments, converts them to an object and conditionally applies a CSS class if the value is truthy

```javascript
class App extends React.Component {
    render() {
        const klass = classnames({
            box: true, // always apply the box class
            alert: this.props.isAlert, // if a prop is set
            severity: this.state.onHighAlert, // with a state
            timed: false // never apply this class
        });
        return (<div className={klass}>)
    }
}
```

For the same reason we cannot use the `class` attribute, we cannot apply the `for` attribute to a `<label>` element. Instead, we must use the attribute `htmlFor`

```javascript
<label htmlFor="email">Email</div>
```

Entities are reserved characters in HTML which include characters such as less-than, greater-than, the copyright symbol, etc. In orrder to display entities, we can just place the entity code in literal text

```javascript
<ul>
  <li>phone: &phone;</li>
  <li>star: &star;</li>
</ul>
```

In order to display entities in dynamic data, we need to surround them in a string inside curly braces. using unicode directly in JS works as expected. Jus as we can send our JS to the browser as UTF-8 text directly. Our browser knows how to display UTF-8 code natively. Instead of usting the entity character code, we can use unicode version instead, as well for emoji

```javascript
return (
  <ul>
    <li>phone: {"\u0260e"}</li>
    <li>star: {"\u2606"}</li>
    <li>dolphin: {"\uD83D\uDC2C"}</li>
  </ul>
);
```

If we want to apply our own attributes that the HTML spec does not cover, we have to prefix the attribute key with the string `data-` This requirements only applies to DOM components that are native to HTML and does not mean custom components cannot accept arbitrary keys as props. That is, we can accept any attribute on a custom component:

```javascript
<span data-highlight={true} />
<Message dismissible={true} />
```

There are a standard set of web accessibility[^3] attributes[^4] and its a good idea to use them because there are many people who will have a hard time using our site without them. We can use any of these attribute on an element with the key prepended with the string `aria-`. For instance, to set the hidden attribute:

```HTML
<div aria-hidden="true" />
```

[^1]: [Shadow DOM](https://www.webcomponents.org/community/articles/introduction-to-shadow-dom)
[^2]: [classnames](https://www.npmjs.com/package/classnames)
[^3]: [Web accessibility](https://www.w3.org/WAI/standards-guidelines/aria/)
[^4]: [Attributes](https://www.w3.org/TR/wai-aria/)
