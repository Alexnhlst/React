let React = require("react");
function MyButton(props) {
  return <button onClick={props.onButtonPress}>Click Me!</button>;
}
module.exports = MyButton;
