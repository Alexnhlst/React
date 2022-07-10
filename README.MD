# Lifecycle Methods :first_quarter_moon:

## Table of contents

1. [Diagram](#diagram)
2. [componentDidMount()](#componentdidmount)
3. [componentWillUnmount()](#componentwillunmount)
4. [componentDidUpdate()](#componentdidupdate)
5. [shouldComponentUpdate()](#shouldcomponentupdate)
6. [getDerivedStateFromProps()](#getderivedstatefromprops)
7. [getSnapshotBeforeUpdate()](#getsnapshotbeforeupdate)
8. [forceUpdate()](#forceupdate) 

---

## Diagram

<div align="center">
    <img src="./lifecycle-diagram.png" alt="Lifecycle Diagram"/>
</div>

- The *Mounting* cycle runs once on an instance creation of each component.
- The *New Props* cycle runs every time the parent component updates the `props`.
- The *setState* cycle runs when the `setState()` method of the component is executed.
- The *forceUpdate* cycle runs when the `forceUpdate()` method is called.
- The *Unmounting* cycle runs once before React removes the component from the DOM.

---

## componentDidMount()

If we define it in our component class, React will call it right after the first time our `render()` method was called. The name means that the component was mounted into the DOM. The most important use-cases for this method are:
    - fetching asynchronous data
    - setting up event listeners

```javascript
let AsyncHelloWorld = createReactClass({
    getInitialState: function() {
        return { data: null };
    },

    componentDidMount: function() {
        let self = this:
        setTimeout(function() {
            self.state({ data: "Hello, world!" });
        }, 2000);
    },

    render: function() {
        let data = this.state.data;
        if (!data) return <p>Loading...</p>;
        return <p>{data}</p>
    }
});
```

1. The initial `state` is `{data: null}`
2. The `render()` method checks the state and `return`s a Loading indicator
3. React calls the `componentDidMount()` method, which simulates asynchronous data retrieval with a timeout
4. The `setState()` method is called after 2000 milliseconds to update the `state` with the received data
5. The `render()` method is called again, this time with the new `state`, so no loading indicator is shown

---

## componentWillUnmount()

This will be the last method of our component class that will be called by React right before our component gets removed from the DOM.
Its main use-case is **cleanup**. You can think of it as a destructor from OOP.

```javascript
let AsyncCounter = createReactClass({
    getInitialState: function() {
        return { count: 0 };
    },

    incrementCounter: function() {
        this.setState(function(prevState) {
            return { count: prevState.count + 1 };
        });
    },

    interval: null,
    componentDidMount: function() {
        this.interval = setInterval(this.incrementCounter, 100);
    },

    componentWillUnmount: function() {
        clearInterval(this.interval);
    },

    render: function() {
        return <p>Count: {this.state.count}</p>
    }
})
```

1. The component gets mounted to the DOM and renders a `<p>Count: 0</p>`, because the initial `state` is `{count: 0}`
2. React calls the `componentDidMount()` method, which sets an interval that increments `state.counter` every 100 milliseconds and stores a handle to it inside a class attribute for later use.
3. Every time the interval executes, the `setState()` method is called, which will lead to a `render()` method call after the state was changed
4. Before the component gets removed from the DOM, React calls:
    - the `componentWillUnmount()` method, which in turn will call
    - the `clearInterval()` function on the handle we stored.

---

## componentDidUpdate()

This method lets us add logic after every update to the DOM. We can, for example, check if `state` or `props` have changed and issue asynchronous calls to fetch new data from the server. React calls this method in the New Props, setState and forceUpdate cycle.

```javascript
let Profile = createReactClass({
  getInitialState: function() {
    return { userName: "..." };
  },

  componentDidMount: function() {
    this.fetchUser(this.props.userId);
  },

  componentDidUpdate: function(prevProps, prevState, snapshot) {
    if (this.props.userId !== prevProps.userId) {
      this.fetchUser(this.props.userId);
    }
  },

  fetchUser: function(userId) {
    fetch("/users/" + userId).then(function(user) {
      this.setState({ userName: user.name });
    });
  },

  render: function() {
    return <h2>{this.state.userName}</h2>;
  }
});
```

---

## shouldComponentUpdate()

This method allows us to tell React when the component should update.
- If we `return false` from this method, React won't bother to update the DOM
- If we `return true` React updates the DOM

**It can't stop the first render or the unmounting/removal** of a component. The primary use-case for this is third-party libraries that render into the DOM directly. We pass `props` or `state` to the library, but we don't want React to re-render the target DOM element the library uses to render its elements.

```javascript
let Graph = createReactClass({
  componentDidMount: function() {
    this.renderGraph(this.props.graphData);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    this.renderGraph(nextProps.graphData);
    return false;
  },

  renderGraph: function(data) {
    let domTarget = document.getElementById(this.props.id);
    // graphLibrary is an imaginary non-React 3rd-party library
    graphLibrary.render(domTarget, data);
  },

  render: function() {
    return <div id={this.props.id} />;
  }
});
```

---

## getDerivedStateFromProps()

This method can be used to update a components `state` when new `props` are received. **It has to be a static method**, which means `this` is not available here. The `return` value of this method gets merged with the current `state` of the component

```javascript
let Timer = createReactClass({
  getInitialState: function() {
    return { seconds: 0 };
  },
  render: function() {
    return <span>Seconds: {this.state.seconds}</span>;
  }
});

Timer.getDerivedStateFromProps = function(nextProps, prevState) {
  let nextState = {
    seconds: nextProps.minutes * 60
  };
  return nextState;
};
```

---

## getSnapshotBeforeUpdate()

This method is called right before React updates the DOM with new `state` and `props`, so we can get any UI state, like scroll position, to scroll the component if some dimensions or some elements have changed. The `return` value will be passed as third argument to the `componentDidUpdate()` lifecycle method.

```javascript
let ScrollList = createReactClass({
  getSnapshotBeforeUpdate: function(prevProps, prevState) {
    if (this.props.listItems.length > prevProps.listItems.length) {
      let list = document.getElementById(this.props.id);
      return list.scrollHeight - list.scrollTop;
    }

    return null;
  },

  componentDidUpdate: function(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      let list = document.getElementById(this.props.id);
      list.scrollTop = list.scrollHeight - snapshot;
    }
  },

  render: function() {
    return <div id={this.props.id}>{/* listItems */}</div>;
  }
});
```

---

## forceUpdate()

This method isn't a lifecycle method, but we can use it inside event-handlers or lifecycle methods. It's pre-defined on a class component object and can be used like the `setState()` method, but without any argument. We can use the forceUpdate() method if we need to re-render based on events of a third party library. Normally we store the data needed for rendering inside this.state, but sometimes we don't want to maintain multiple versions of the data. This requires us to tell React when we need a new render.

```javascript 
let Example = createReactClass({
  componentDidMount: function() {
    let self = this;
    library.onNewData(function() {
      self.forceUpdate();
    });
  },
  render: function() {
    let dataList = library.getDataList();
    
    return (
      <ul>
        {dataList.map(item => <li>{item.title}</li>)}
      </ul>
    );
  }
});

```