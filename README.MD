# JSX :building_construction:

## Table of contents

1. [JSX Compilation](#jsx-compilation)
2. [A Simple Element](#a-simple-element)
3. [A Complex Element](#a-complex-element)
4. [Nested Elements](#nested-elements)

---

## JSX Compilation

JSX **needs an extra compile step** to run in a browser. There are ways to use JSX compilers like Babel directly in the browser with a `<script>` tag.

>Babel is **JavaScript compiler**; it is used to compile *new JavaScript features* down to an older version of JavaScript, so that the new features can be used in older browsers that don't implement them natively. In this case, it **compiles down JSX to regular JavaScript function calls**

Because Babel itself is JavaScript we can include the Babel compiler into our app by adding a `<script>` tag and the instructing Babel to compile our JSX/JavaScript code.
Babel, in this case, is included via a `<script>` tag from the *Unpkg* content delivery network

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js">
```

>A content delivery network, short CDN, is a service that provides hosting for content. Unpk mirrors the NPM registry and makes the NPM packages available via HTTP, so no extra tooling is required to use them.

If you use the sand-alone version of Babel in the browser, you have to write your JSX and JavaScript inside a `<script type="text/babel">` tag.

---

## A Simple Element

```JavaScript
let anotherElement = <p>A nice text paragraph.</p>
```

Thid would be compiled down to: 

```JavaScript
anotherElement = React.createElement(
  "p",
  null,
  "A nice text paragraph."
);
```

The **JSX tags will be converted to JavaScript function calls** to `React.createElement()`. The key idea of what's going on here is that **we are simply using the JSX syntax as a shorthand for the JavaScript `React.createElement()` call.**
The *tag name* will become the first, or `type`, parameter of the function, so different tags don't call different functions here, they just supply different `type` parameters to the same function. One of the powerful features of JSX is that we can compose, not only primitive HTML elements, but we can also create our own component elemnts. In order for JSX to support that, there are two cases for the element tag name:
If the tag name is `lowercase` it will be **passed as a string to the function call**, the function will then try to create a regular VDOM element.
If the tag name is `UpperCase` it will be **passed as a variable to the function call**, a variable of the same name as the tag name. If no such variable exists in the current scope, you get an error. This feature is used to create elements from custom components, one major feature of React.
The content of the element can be another element or, in our case, text. This will be passed into the third, or `children`, paramenter of the function. This allows you to create nested elements like in HTML.

---

## A Complex Element

```JavaScript
 let reactElement = (
        <h1
          className="abc"
          style={{ textAlign: "center" }}
          onClick={function () {
            alert("click");
          }}
        >
          Hello, world!
        </h1>
      );
```

**Curly braces are used to embed JavaScript directly into JSX**. For example, look at the `style` attribute:

```JavaScript
style={{ textAlign: "center" }}
```

In this case, we have an inner, plain JavaScript object:

```JavaScript
{
    textAlign: "center"
}
```

and the syntax in JSX is to use curly braces to define a JavaScript attribute.
We can create a prop with a string value like we do in HTML, by adding `propName="value`. In this case a string prop is created and added to the object that is passed to the `React.createElement()` function call. **You can also use all other JavaScript values**, you just have to wrap them in curly braces like this `propName={function() {}}`.
This feature also works with the `content` of your element, or your `children` if you like. For example, if we had a `loggedIn` variable, we could use JavaScript logic to either render a "logged-in" greeting element or a "Please sign in!" element:

```JavaScript
<h1>{loggedIn ? "Hello" + userName + "!" : "Please sign in!"}</h1>;
```

---

## Nested Elements

The content of an element will be pushed into the `children` argument of a call to the `React.createElement()` function. **This also works if the nested element is another element**:

```JavaScript
<p>
    <strong>Text</strong>
</p>
```

will end up as:

```JavaScript
React.createElement("p", null, React.createElement("strong", null, "Text"));
```

You can also **insert your regular JavaScript into JSX** and it will be executes as you would expect.

```JavaScript
let myClass = "abc";

function myText() {
    return "world";
}

// JavaScript insertion has the same syntax in attributes as in normal text or elements
reactElement = (
    <div className={myClass}>
        <h1>Hello {10 * 10}</h1>
        <h2>{myText()}</h2>
    </div>
);
```

>The JavaScript in the curly braces `{}` **must be an *expression***. This means it needs to evaluate to a *value*. Statements, like `if`, `switch` or `while`, are not allowed as the first keyword after the opening brace. If you need conditional logic, you can use the ternary operator, as in `{ booleanVal ? "it was true" : "it was false" }`