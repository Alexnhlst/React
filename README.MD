# Integration

## Table of contents

1. [Simple Integration](#integration)
    - [Including the library]()
    - [Using the library]()
    - [Complex example]()
2. [Advanced Integration](#advanced-integration)
    - [Including the library](#including-the-library-1)
    - [Using the library](#using-the-library-1)
    - [Refs and Lifecycle methods](#refs-and-lifecycle-methods)
    - [Complex example](#complex-example-1)
---

## Simple Integration

One of the most frequent tasks of software development is the integration of third-party libraries, and since the advent of JavaScript package manager NPM, JavaScript projects have become well known for the accumulation of many small libraries. In this part, we integrate a simple library called Moment.js [^1]

### Including the library

```HTML
<script src="https://unpkg.com/moment@2.18.1/min/moment.min.js"></script>
```

First, we include the libraries source to our web page. Because Moment.js is used all over the Web, there is a pre-built version ready to be loaded right in the browser with a `<script>` tag. After the inclusion of the script, a global function `moment()` is available.

### Using the library

```JavaScript
let DateToday = function() {
    return <span>{moment().format("DD.MM.YYYY")}</span>;
}
```

We create a simple component that renders the current date. The call to `moment()` returns a Moment.js date-object that is pre-configured for the current date. The `.format()` method, called on the date-object, takes a template string it uses to format the date and returns a string where all the placeholders of the template string are replaced with real values. JSX can rendere strings with no problem, so we can now use the returned string, wrap it in a `<span>` element and return the whole thing.

### Complex example

We can also use objects created elsewhere and use them inside JSX.

```JavaScript
let tomorrow = moment().add(1, "day");
```

The call to `moment()` returns a Moment.js date-object for the current day, the call to the `.add()` method lets us modify this date-object. We use it to add 1 day and get a date-object to store in the `tomorrow` variable. While we can't use the object directly, we can use calls to its `.format()` method to extract formatted strings from it that can be used inside JSX' curly braces.

```JavaScript
let reactElement = (
    <div>
        <h1 style={{ textAlign: "center" }}>
            Tomorrow is {tomorrow.format("MMMM")} the {tomorrow.format("Do")}
        </h1>
        <DateToday />
    </div>
)
```

---

## Advanced Integration

Most libraries supply us with a bunch of functions that we can call and use their results, but sometimes some libraries need more to work. In this part, we'll use D3 [^2], a famous general data visualization library.

### Including the library

```HTML
<script src="https://unpkg.com/d3@4.7.3/build/d3.min.js"></script>
```

First, we include the libraries source to our web-page. D3, like Moment.js in the last lesson, is also a popular library, so there is a pre-built version ready to be loaded right in the browser with a `<script>` tag.
After the inclusion of the script, a global `d3` object is available.

### Using the library

Like React, D3 needs access to a DOM element as a root element to render into.

```JavaScript
d3.select("#app")
  .append("canvas")
  .node()
  .getContext("2d")
  .fillRect(10, 10, 100, 100);
```

We iuse D3's `select()` method to get an object which holds a reference to the `<div>` element with the ID `app`. Then we use this object to append a `<canvas>` element to it. The `node()` method gets us a direct reference to the `<canvas>` so we can use it to get access to its drawing context, which we use to draw the rectangle. The crux of this example is, we need the drawing context, and we can only obtain it from a `<canvas>` element, which is rendered somewhere in the DOM. React wants us to work with virtual DOM elements, which won't help us much here, so we need to resort to other methods of DOM interaction here.

### Refs and Lifecycle methods

- Refs allow us to mark a virtual DOM element in JSX to tell React that we require a reference to it when it's rendered.
- The `componentDidMount()` lifecycle method allows us to do thing when React rendered a virtual DOM element to the real DOM.

We can use these two features in tandem to tell React to render a `<canvas>` element, which we need for D3 and to notify us when it is available in the DOM.

```JavaScript
let Square = createReactClass({
  getInitialState: function () {
    this.canvas = React.createRef();
    return {};
  },
  render: function () {
    return <canvas ref={this.canvas} />;
  },
  componentDidMount: function () {
    d3.select(this.canvas.current)
      .node()
      .getContext("2d")
      .fillRect(10, 10, 100, 100);
  },
});
```

1. The `getInitialState()` method is called, it creates a ref-object and stores it in `this.canvas`.
2. React calls the `render()` method, it tells React to render a `<canvas>` element and passes the ref-object created before to its `ref` prop.
3. When React rendered the `<Square>` component, and with it the `<canvas>` element, into the DOM it calls the `componentDidMount()` lifecycle method. In this method, the ref-object stored in `this.canvas` is now up-to-date, and it's `current` attribute holds a reference to the `<canvas>` element in the real DOM
4. We can use `this.canvas.current` with D3's `select()` method to get the drawing context we need to draw the square.

### Complex example

For more complex integrations, we can move the library interactions into a separate function and pass DOM references to it as arguments, when React finished doing its things.

```JavaScript
function drawGraph(canvas, strokeColor) {
  // An example from
  // http://bl.ocks.org/mbostock/1b64ec067fcfc51e7471d944f51f1611
  // its released under the GPL-V3
  let n = 20;

  let nodes = d3.range(n * n).map(function (i) {
    return { index: i };
  });

  let links = [];
  for (let y = 0; y < n; ++y) {
    for (let x = 0; x < n; ++x) {
      if (y > 0) links.push({ source: (y - 1) * n + x, target: y * n + x });
      if (x > 0) links.push({ source: y * n + (x - 1), target: y * n + x });
    }
  }

  d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-30))
    .force("link", d3.forceLink(links).distance(20).iterations(10))
    .on("tick", ticked);

  let context = canvas.getContext("2d");
  let width = canvas.width;
  let height = canvas.height;

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = "#aaa";
    context.stroke();

    context.beginPath();
    nodes.forEach(drawNode);
    context.fill();
    context.strokeStyle = strokeColor;
    context.stroke();

    context.restore();
  }

  function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d) {
    context.moveTo(d.x + 3, d.y);
    context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }
}
```

The `drawGraph()` function encapsulates all the D3 interactions. Its arguments are only a reference to a `<canvas>` element and a color configuration.
It does many things that seem quite complicated, but it does these only with the arguments supplied to it, and we know how to create these arguments before calling the function.
We can call this function in our React component from before with minimal changes.

```JavaScript
let Visual = createReactClass({
  getInitialState: function () {
    this.canvas = React.createRef();
    return {};
  },
  render: function () {
    return <canvas ref={this.canvas} />;
  },
  componentDidMount: function () {
    drawGraph(this.canvas.current, this.props.color);
  },
});
```

- We have to rename the component to `Visual`.
- Then we use the `drawGraph()` function inside the `componentDidMount()` method, so we have the reference to the `<canvas>` element ready.
- As the second argument to the `drawGraph()` function, we pass the color prop of our Visual component.

Now we can use the `Visual` component like every other component in JSX even though it requires a third party library and direct DOM access to do its work and we didn't even use global DOM IDs for this, so if we create multiple copies of the component, they all work independently of each other.


[^1]: [Moment.js](https://momentjs.com/)
[^2]: [D3](https://d3js.org/)