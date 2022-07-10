# Props :card_file_box:

## Table of contents

1. [Call-Site Props](#call-site-props)
2. [Definition-Site Props](#definition-site-props)
3. [Default Props](#default-props)
4. [Props Spreading](#props-spreading)
5. [Prop Types](#prop-types)

---

## Call-Site Props

When we set `className` or `style` we're using props.

```javascript
<p className="black-text" style={{ fontSize: 42 }}>
    Text
</p>
```

The props of this example get compiled to a props-object, which will look like this:

```javascript
{
    className: "black-text",
    style: {
        fontSize: 42
    }
}
```

This object is passed into the `React.createElement()` function as the second/`props` argument (or `null` when no props are used).

```javascript
let reactElement = <MyComponent className="abc" customData="world" />;
```

>Remember, we can pass much more than strings to props. We could also pass functions, numbers, objects or other types into the `props` -- as long as we use curly braces

These props in JSX look a lot like attributes in HTML. We call these key/value pairs: *call-site props*. That is these are the props at the site that calls our component in the JSX.

---

## Definition-Site Props

How can we use `props` inside our components?

```javascript
function MyComponent(props) {
        return (
          <div className={props.classname}>
            <h1>Hello</h1>
            <h2>{props.customData}</h2>
          </div>
        );
      }
```

Every **functional component** receives the `props` object as first argument. It's the same props object that is passed to the `React.createElement()` function as second argument.

---

## Default Props

It is also possible to define default `props` by setting the `defaultProps` attribute of the component to an object. Its keys are the name of the props we want defaults for and its values are the actual values.

```javascript
MyComponent.defaultProps = {
    customData: "default-data",
    className: "default-class"
}
```

---

## Props Spreading

It is also possible to `spread` an object onto an element. This allows for a dynamic amount of `props` passed to an element right in JSX without the need to fall back to JavaScript syntax.

```javascript
let props = {
  className: "abc",
  customData: "world"
};

reactElement = <MyComponent {...props} />;
```

>There are reserved names for `props`: `key` and `ref`. They have special meaning for React and won't be accessible inside of a component late. `key` is used when rendering an array, to tell React which child is which and `ref` is used as a non-global alternative to the `id` prop we know from HTML

---

## Prop Types

There exist multiple solutions to prevent components from using invalid values, like static typing[^1] with Flow[^2] or TypeScript[^3], but those solutions involve essentially using another programming language which requires a compile-to-JavaScript step.
Instead of checking the types of the props at compile time, we can implement a solution in JavaScript by checking at *runtime*. React has a library for type checking at run time called **prop types**.
Prop-types are an **optional** part of React and come in their own NPM package.
We can include them with a `<script>` tag from the Unpkg CDN:

```HTML
<script src="https://unpkg.com/prop-types@15.6.1/prop-types.js"></script>
```

The main idea of prop-types is that we **add a `propTypes` attribute to our component function.** Then, React will use these `propTypes` to validate the `props` passed in to this component. This validation will happen when the code that passes the `props` is executed, hence **runtime type checking. We have to run the code** in some fashion that triggers the type check to see if everything is correct.

```javascript
function MyComponent(props) {
    return (
        <div className={props.className}>
            <h1>Hello</h1>
            <h2>{props.customData}</h2>
        </div>
    );
}
```

The component passes its `customData` prop down to the `<h2>` elements `children` prop. We know this expects a value of type string, so we add a prop-type for this prop to the component.

```javascript
MyComponent.propTypes = {
    // React supplies us with a bunch of types, like string
    customData: PropTypes.string,
};
```

We set the attribute `propTypes` to an object that contains our validators.
- Keys of the `propTypes` object are the names of the prop we want to check
- Values are the actual *validators*. These come from the `prop-types` package

>The prop-types packages comes with many validators for basic types, like `string`, `number`, `bool`, `func`, `array` etc. It also has React specific types like `node` or `element` and allows for the check of custom object types and much more. [^4]

In this case we simply check if the `customData` prop is of type `string`, if we would pass a `number` into it we would get the following warning at runtime:

```🇸hell
Warning: Failed prop type: Invalid prop `customData` of type `number`
supplied to `MyComponent`, expected `string`.
```

[^1]: [static typing](https://stackoverflow.com/questions/1517582/what-is-the-difference-between-statically-typed-and-dynamically-typed-languages)
[^2]: [Flow](https://flow.org/)
[^3]: [TypeScript](https://www.typescriptlang.org/)
[^4]: [Documentation](https://www.npmjs.com/package/prop-types)