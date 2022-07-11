let React = require("react");
let renderer = require("react-test-renderer");
let MyButton = require("./MyButton");

describe("MyButton", function () {
  it("calls function on click", function () {
    let callback = jest.fn();
    let result = renderer
      .create(<MyButton onButtonPress={callback} />)
      .toJSON();
    result.props.onClick();
    expect(callback.mock.calls.length).toBe(1);
  });
});
