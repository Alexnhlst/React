# Basics :construction:

## Table of contents

1. [What's the point of React?](#whats-the-point-of-react)
2. [Object Elements](#object-elements)

---

## What's the point of React?

When we're using React, the problem we're trying to solve is how to update our "HTML" view with **dynamic data** and **user interactions**.
**React manages the view layer of your application.**
That is, you take your **data** and you pass it to **React** and the output is your "HTML" view.
At a high level, you can roughly think of what React does as the equation:

```javascript
reactApp(yourData) => rendered view
```

jQuery's approach is basically to manipulate the DOM directly. jQuery gives you, as its name implies, query methods that allow to get access to DOM elements.
Once you have a reference to a DOM elements you imperatively write text into your DOM nodes, add event listeners and so on. The problem with is that this gets unwieldy fast.
It starts small: you add a few elements to a list, change a `<p>` here and there, but as the application grows and requirements change you end up with hundreds of elements that all need to be updated dynamically.
If you're not careful the performance of your app can suffer. You're forced to craft some sophisticated algorithms that don't thrash the DOM and bring the browser to its knees.
Furthermore, it's just hard to keep track of the resulting nest of code -- it can be difficult to orchestrate those handlers to all work together.

React tries to solve this problem for you and it does it with **the help of a *virtual* DOM** (VDOM), which is just a fancy name for **plain old JavaScript objects** nested to resemble the structure of a DOM. 

---

## Object Elements

```html:src/index.html [61-69]

```