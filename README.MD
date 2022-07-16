# Unit Testing

## Table of contents

1. [Introduction](#introduction)
2. [Writing test without a framework](#writing-test-without-a-framework)
3. [Writing the first spec](#writing-the-first-spec)

---

## Introduction

A robust test suite is a vital constituent of quality software. With a good test suite at his or her disposal, a developer can more confidently refactor or add features to an application. Test suites are an upfront investment that pay dividends over the lifetime of a system. Testing user interfaces is notoriously difficult. Thankfully, testing React components is not. With the right tools and the right methodology, the interface for your web app can be just as fortified with tests as every other part of the system.

---

## Writing test without a framework

The structure of the project (inside the `basics` folder) is:

```sh
❯ ls -1p
__fs/
Modash.js
Modash.test.js
package.json
package-lock.json
```

We'll be using `babel-node` to run our test suite from the command-line. It is included in the `package.json`

```sh
❯ npm install
```

We'll write a small library in `Modash.js` (a play on the popular JavaScript utility library Lodash[^1]). It will have some methods that might prove useful when working with JavaScript strings. We'll write the following three methods, each returns a string:

- `truncate(string, length)`

Truncates `string` if it's longer than the supplied `length`. If the string is truncated, it will end with `...`

```JavaScript
const truncate = (string, length) => {
  if (string.length > length) {
    return string.slice(0, length) + "...";
  } else {
    return string;
  }
};
```

- `capitalize(string)`

Capitalize the first letter of `string` and lower cases the rest

```JavaScript
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
```

- `camelCase(string)`

Takes a string of words delimited by spaces, dashes, or underscores and returns a camel-case representation.

```JavaScript
const camelCase = (string) => {
  const words = string.split(/[\s|\-|_]+/);
  return [
    words[0].toLowerCase(),
    ...words.slice(1).map((w) => capitalize(w)),
  ].join("");
};
```

> String's `split()`[^2] splits a string into an array of strings. It accepts as an argument the character(s) you would like to split on. The argument can be either a string or a regular expression
>
> Array's `join()`[^3] combines all the members of an array into a sting

At the bottom of `Modash.js`, we first create the object that encapsulates our methods, and then we export it

```JavaScript
const Modash = {
  truncate,
  capitalize,
  camelCase,
};

export default Modash;
```

> Our `package.json` already includes Babel. In addition, we're including a Babel plug-in, `babel-plugin-transform-es2015-modules-commonjs`. This package will let us use the ES6 import/export syntax. Importantly, we specify it as a Babel plugin inside the project's `.babelrc`:
>
> ```json
> {
>   "plugins": ["transform-es2015-modules-commonjs"]
> }
> ```
>
> With this plugin in place, we can now export a module from one file and import it into another. However, note that this solution won't work in the browser. It works locally in the Node runtime, which is fine for the purposes of writing tests for our Modash library. But to support this in the browser requires additional tooling.

---

## Writing the first spec

Our test suite will import the library we're writing tests for. We'll call methods on that library and make assertions on how the methods should behave. At the top of `Modash.test.js` we import the library

```JavaScript
import Modash from "./Modash";
```

Our first assertion will be for the method `truncate`. We're going to assert that when given a string over the supplied length, `truncate` returns a truncated string

```JavaScript
const string = "there was one catch, and that was CATCH-22";
const actual = Modash.truncate(string, 19);
const expected = "there was one catch...";
```

In test suites, actual is what we call the behavior that was observed. expected is the value we are expecting. Next, we make our test's assertion. We'll print a message indicating whether `truncate` passed or failed:

```JavaScript
if (actual !== expected) {
  console.log(
    `[FAIL] Expected \`truncate()\` to return '${expected}', got '${actual}'`
  );
} else {
  console.log("[PASS] `truncate()`.");
}
```

We can run our test suite at this state in the command line:

```sh
❯ ./node_modules/.bin/babel-node  Modash.test.js
[PASS] `truncate()`.
```

[^1]: [Lodash](https://lodash.com/)
[^2]: [split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
[^3]: [join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
