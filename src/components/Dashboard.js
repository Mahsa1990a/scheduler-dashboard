import React, { Component } from "react";
import classnames from "classnames";
import axios from "axios";

import Loading from "./Loading";
import Panel from "./Panel";

//helper functions
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";

import { setInterview } from "helpers/reducers";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  
  state = { 
    loading: true,
    focused: null, //when I change it to 1 or 2 or 3 or 4 shows panels individually 
    days: [],
    appointments: {},
    interviewers: {}
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
    
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };
  }

  componentDidUpdate(previousProps, previousState) {

    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
  
  componentWillUnmount() {
    this.socket.close();
  }

  //we want to change the focused state, we can use the this.setState function to make the change
  /* Instance Method */
  selectPanel(id) {
    //update it to back to null from individual pages
    this.setState(previousState => ({
      // focused: id
      focused: previousState.focused !== null ? null : id
    }));
  } 

  render() {
    //console.log("this.state: ", this.state) will show 2 outputs/ one from render during mount phase, second result of update phase
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    //console.log("this.state: ", this.state); //will only show the second output once the data is loaded

    const panels = data
    //When we are in focused mode, we want to render one
    .filter(
      panel => this.state.focused === null || this.state.focused === panel.id
    )
    //shows each panel individually but all together
    .map(panel => (
      <Panel 
        key={panel.id}
        // id={panel.id}
        label={panel.label}
        // value={panel.value} updated to :
        value={panel.getValue(this.state)}
        // onSelect={this.selectPanel} updated to:
        onSelect={event => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}
//Same component without classes :
// function Dashboard(props) {
//   const dashboardClasses = classnames("dashboard");
//   return <main className={dashboardClasses} />;
// }

export default Dashboard;
