let React = require("react");
let renderer = require("react-test-renderer");
let MyComponent = require("./MyComponent");

describe("MyComponent", function () {
  it("renders hello world", function () {
    let result = renderer.create(<MyComponent />).toJSON();
    expect(result.children[0]).toBe("Hello, World!");
  });
});
