# Components and servers

## Table of contents

1. [Introduction](#introduction)
2. [The Server API](#the-server-api)

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

[^1]: [jq](https://stedolan.github.io/jq/)
