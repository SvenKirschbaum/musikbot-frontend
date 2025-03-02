import {Component} from 'react';
import moment from "moment/min/moment-with-locales";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => {
        this.setState({
          date: new Date()
        });
      },
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
        <span className={this.props.className}>{moment(this.state.date).format("HH:mm")}</span>
    );
  }
}

export default Clock;