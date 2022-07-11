function ViewBefore(props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Room</th>
          <th>People</th>
        </tr>
      </thead>
      <tbody>
        {props.rooms.map(function (room, k) {
          return (
            <tr key={k}>
              <td>{room.name}</td>
              <td>{room.people}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

ViewBefore.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      people: PropTypes.number.isRequired,
    })
  ).isRequired,
};

function ViewAfter(props) {
  return (
    <div>
      {props.rooms.map(function (room, k) {
        let barStyle = {
          display: "inline-block",
          background: "lightgrey",
          width: room.people * 25,
        };
        return (
          <div key={k}>
            {room.people > 0 ? (
              <span style={barStyle}>{room.people} People</span>
            ) : (
              <span>0 People</span>
            )}
            <span>in {room.name}</span>
          </div>
        );
      })}
    </div>
  );
}

ViewAfter.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      people: PropTypes.number.isRequired,
    })
  ).isRequired,
};

let ViewDynamic = createReactClass({
  // We still keep the props-interface the same
  propTypes: {
    rooms: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        people: PropTypes.number.isRequired,
      })
    ).isRequired,
  },

  getInitialState: function () {
    return { currentRoom: 0 };
  },

  componentDidMount() {
    let component = this;
    let props = this.props;

    this.interval = setInterval(function () {
      let currentRoom =
        component.state.currentRoom < props.rooms.length - 1
          ? component.state.currentRoom + 1
          : 0;
      component.setState({ currentRoom: currentRoom });
    }, 1000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render: function () {
    let room = this.props.rooms[this.state.currentRoom];

    return (
      <span style={{ color: this.state.color }}>
        Room <b>{room.name}</b> has <b>{room.people}</b> People.
      </span>
    );
  },
});
