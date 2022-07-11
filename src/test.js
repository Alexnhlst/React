let PomodoroApp = createReactClass({
  IDLE: 0,
  WORK: 1,
  PAUSE: 2,

  getInitialState: function () {
    return {
      count: 0,
      timerState: this.IDLE,
    };
  },

  handleWork: function () {
    this.setState({ timerState: this.WORK });
  },

  handlePause: function () {
    this.setState(function (prevState) {
      return {
        count: prevState.count + 1,
        timerState: this.PAUSE,
      };
    });
  },

  handleIdle: function () {
    this.setState({ timerState: this.IDLE });
  },

  getTimerElement: function () {
    let timerState = this.state.timerState;

    if (timerState == this.PAUSE)
      timerElement = (
        <Timer
          key="pause"
          title="Pause"
          color="green"
          minutes={5}
          onFinish={this.handleWork}
          onStop={this.handleIdle}
        />
      );

    if (timerState == this.WORK)
      timerElement = (
        <Timer
          key="work"
          title="Work"
          color="orange"
          minutes={25}
          onFinish={this.handlePause}
          onStop={this.handleIdle}
        />
      );

    return <Idle onStart={this.handleWork} />;
  },

  style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  render: function () {
    let count = this.state.count;
    return (
      <div>
        <h1>Pomodoro Timer</h1>
        {this.getTimerElement()}
        {!!count && <h2>You worked {count * 25} minutes today!</h2>}
      </div>
    );
  },
});
