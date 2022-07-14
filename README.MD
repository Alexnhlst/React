# Components and servers

## Table of contents

1. [Introduction](#introduction)
2. [The Server API](#the-server-api)
3. [Loading state from the server](#loading-state-from-the-server)
4. [Fetch API](#fetch-api)

---

## Introduction

As in all React apps, data flows from the top down through the component tree to leaf components. Leaf components communicate events to state managers by calling prop-functions. At the moment, `TimersDashboard` has a hard-coded initial state. Any mutations to the state will only live as long as the browser window is open. That's because all state changes are happening in-memory inside of React. We need our React app to communicate with a server. The server will be in charge of persisting the data. In this app, data persistence happens inside of `data.json`.
`server.js` is a Node.js server specifically designed for our time-tracking app. It uses the file `data.json` as its "store". The server will read and write to this file to persist data. It will return the contents of `data.json` when asked for all items. When notified, the server will reflect any updates, deletes, or timer stops and starts in `data.json`

---

## The Server API

We're not going to move all state management exclusively to the server. Instead, the server will maintain its state (in `data.json`) and React will maintain its state (in this case, within `this.state` in `TimersDashboard`)
If we perform an operation on the React ("client") state that we want to be persisted, then we also need to notify the server of that state change. This will keep the two states in sync. The write operations we want to send to the server are:

- A timer is created
- A timer is updated
- A timer is deleted
- A timer is started
- A timer is stopped

We'll have just one read operation: requesting all of the timers from the server.
This entire time, `server.js` has actually been responsible for serving the app. When your browser requests `localhost:3000/`, the server returns the file `index.html`, which loads in all of our JavaScript/React code. Note that React never makes a request to the server at this path. This is just used by the browser to load the app. React only communicates with the JSON endpoints.
`data.json` contains an array of objects. While not strictly JavaScript, the data in this array can be readily loaded into JavaScript.

```javascript
fs.readFile(DATA_FILE, (err, data) => {
  const timers = JSON.parse(data);
  // ...
});
```

`data` is a string. `JSON.parse()` converts this string into an actual JavaScript array of objects.

**GET /api/timers**

Returns a list of all timers.

**POST /api/timers**

Accepts a JSON body with `title`, `project`, and `id` attributes. Will insert a new timer object into its store.

**POST /api/timers/start**

Accepts a JSON body with the attribute `id` and `start` (a timestamp). Hunts through its store and finds the timer with the matching `id`. Sets `runningSince` to `start`

**POST /api/timers/stop**

Accepts a JSON body with the attribute `id` and `stop` (a timestamp). Hunts through its store and finds the timer with the matching `id`. Updates `elapsed` according to how long the timer has been running (`stop - runningSince`). Sets `runningSince` to `null`

**PUT /api/timers**

Accepts a JSON boddy with the attributes `id` and `title` and/or `project`. Hunts through its store and finds the timer with the matching `id`. Updates `title` and/or `project` to new attributes

**DELETE /api/timers**

Accepts a JSON body with the attribute `id`. Hunts through its store and deletes the timer with the matching `id`.

Visiting the endpoint `/api/timers` (`localhost:3000/api/timers`), the browser makes a GET request and returns all of the timers:

```json
[
  {
    "title": "Mow the lawn",
    "project": "House Chores",
    "elapsed": 5456099,
    "id": "0a4a79cb-b06d-4cb1-883d-549a1e3b66d7"
  },
  {
    "title": "Clear paper jam",
    "project": "Office Chores",
    "elapsed": 1273998,
    "id": "a73c1d19-f32d-4aff-b470-cea4e792406a"
  },
  {
    "title": "Ponder origins of universe",
    "project": "Life Chores",
    "id": "2c43306e-5b44-4ff8-8753-33c35adbd06f",
    "elapsed": 11750,
    "runningSince": 1456225941911
  }
]
```

> The same can be done running the command
>
> ```shell
> curl -X GET localhost:3000/api/timers
> ```
>
> The `-X` flag specifies which HTTP method to use

To start one of the timers, a PUT request can be issued to the `/api/timers/start` endpoint. We need to send along the id of one of the timers and a start timestamp:

```shell
curl -X POST \
-H 'Content-Type: application/json' \
-d '{"start":1456468632194,"id":"a73c1d19-f32d-4aff-b470-cea4e792406a"}' \
localhost:3000/api/timers/start
```

The `-H` flag sets a header for our HTTP request, `Content-Type`. We're informing the server that the body of the request is JSON.
The `-d` flag sets the body of our request. curl will quickly return without any output. The server doesn't return anything on success for this endpoint. Opening `data.json` will show that the timer specified now has a `runningSince` property.

```json
{
  "title": "Clear paper jam",
  "project": "Office Chores",
  "elapsed": 1273998,
  "id": "a73c1d19-f32d-4aff-b470-cea4e792406a",
  "runningSince": 1456468632194
}
```

> The backslash `\` is used to break the command out over multiple lines for readability.

> A great tool to use with `curl` is `jq`[^1]. You can pipe curl responses directly into `jq` to have the response pretty-formatted
>
> ```shell
> curl -X GET localhost:3000/api/timers | jq "."
> ```
>
> You can also do some manipulation of JSON, like iterating over all objects in the response and returning a particular field.
>
> ```shell
> curl -X GET localhost:3000/api/timers | jq ".[] | { id }"
> ```

---

## Loading state from the server

The client library defined in `public/js/client.js` is used to load state from the server. We can use `client.getTimers()` to call the `/api/timers` endpoint from our React app. We'll do this to "hydrate" the state kept by `TimersDashboard`. When we call `client.getTimers()`, the network request is made asynchronously. The function call is not going to return anything useful. Instead, we can pass `getTimers()` a success function. It will invoke that function after it hears back from the server if the server successfully returned a result. It will invoke the function with a single argument, the list of timers returned by the server

```javascript
client.getTimers((serverTimers) => (
  // ...
))
```

> `client.getTimers()` uses the Fetch API. For ourpurposes, the important thing to know is that when `getTimers()` is invoked, it fires off the request to the server and then returns control flow immediately. The execution of our program does not wait for the server’s response. This is why `getTimers()` is called an asynchronous function. The success function we pass to `getTimers()` is called a callback. We’re saying: “When you finally hear back from the server, if it’s a successful response, invoke this function.” This asynchronous paradigm ensures that execution of our JavaScript is not blocked by I/O.

We'll initialize our component's state with the `timers` property set to a blank array. This will allow all components to mount and perform their initial render. Then, we can populate the app by making a request to the server and setting the state.

```javascript
class TimersDashboard extends React.Component {
  state = {
    timers: [],
  };

  componentDidMount() {
    this.loadTimersFromServer();
    setInterval(this.loadTimersFromServer, 5000);
  }

  loadTimersFromServer = () => {
    client.getTimers((serverTimers) => this.setState({ timers: serverTimers }));
  };
```

<details>
  <summary>More info</summary>

> 1. Before initial render
>
> React initializes the component. `state` is set to an object with the property `timers`, a blank array, is returned

> 2. The initial render
>
> React then calls `render()` on `TimersDashboard`. In order for the render to complete, `EditableTimerList` and `ToggleableTimerForm` -- its two children -- must be rendered

> 3. Children are rendered
>
> `EditableTimerList` has its render method called. Because it was passed a blank data array, it simply produces the following HTML output:
>
> ```HTML
> <div id="timers"></div>
> ```
>
> `ToggleableTimerForm` renders the + button

> 4. Initial render is finished
>
> With its children rendered, the initial render of `TimersDashboard` is finished and the HTML is written to the DOM

> 5.`componentDidMount` is invoked
>
> Now that the component is mounted, `componentDidMount()` is called on `TimersDashboard`. This method calls `loadTimersFromServer()`. In turn, that function calls `client.getTimers()`. That will make the HTTP request to our server, requesting the list of timers. When `client` hears back, it invokes our success function. On invocation, the success function is passed one argument, `serverTimers`. This is the array of timers returned by the server. We then call `setState*()`, which will trigger a new render. The new render populates our app with `EditableTimer` children and all of their children. The app is fully loaded.
> We also do one other interesting thing in `componentDidMount`. We use `setInterval()` to ensure`loadTimersFromServer()` is called every 5 seconds. While we will be doing our best to mirror state changes between client and server, this hard-refresh of state from the server will ensure our client will always be correct should it shift from the server

</details>

Any action will be wiped out within five seconds. Every five seconds, state is restored from the server. We’re loading the initial state from the server. We have an interval function in place to ensure the client app’s state does not drift from the server’s in a multi-instance scenario. We’ll need to inform our server of the rest of our state changes: creates, updates (including starts and stops), and deletes.

---

## Fetch API

Until Fetch, JavaScript developers had two options for making web requests: Use `XMLHttpRequest`, which is supported natively in all browsers, or import a library that provides a wrapper around it (like jQuery's `ajax()`). It provides a better interace than `XMLHttpRequest`.

```javascript
function getTimers(success) {
  return fetch("/api/timers", {
    headers: {
      Accept: "application/json",
    },
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(success);
}
```

`fetch()` accepts two arguments:

- The path to the resource we want to fetch
- An object of request parameters

[^1]: [jq](https://stedolan.github.io/jq/)
