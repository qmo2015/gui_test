import React, { Component } from "react";
import ShiftSwitch from "./components/shiftSwitch";
import TechnicianSearchList from "./components/technicianSearchList";
import NameAndDate from "./components/nameAndDate";
import TableAndDescription from "./components/tableAndDescription";
import ProgressAndSubmit from "./components/progressAndSubmit";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="shift-form">
          <div className="switch-switch-pos">
            <ShiftSwitch />
          </div>
          <div className="form">
            <div className="form-left">
              <TableAndDescription />
            </div>
            <div className="form-right">
              <div>
                <NameAndDate />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <ProgressAndSubmit />
          </div>
        </div>
        <div className="technician-search-list">
          <TechnicianSearchList />
        </div>
      </div>
    );
  }
}

export default App;
