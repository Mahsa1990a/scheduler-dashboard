import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";

import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  
  state = { 
    loading: false,
    focused: null 
  };

  render() {
    
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    
    const panels = data
    //When we are in focused mode, we want to render one
    .filter(
      panel => this.state.focused === null || this.state.focused === panel.id
    )
    //shows each panel individually but all together
    .map(panel => (
      <Panel 
        key={panel.id}
        id={panel.id}
        label={panel.label}
        value={panel.value}
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
