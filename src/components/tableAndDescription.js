import React, { Component } from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import TechnicianData from "../store/technicianData";
import { updateDescription, updateSchedule } from "../action/technicianActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";

// shift table and description component
class TableAndDescription extends Component {
  constructor() {
    super();
    this.state = {
      description: TechnicianData.getDescription(),
      schedule: TechnicianData.getShiftSchedule()
    };
  }
  componentDidMount() {
    TechnicianData.on("descriptionChange", () => {
      this.setState({
        description: TechnicianData.getDescription()
      });
    });
    TechnicianData.on("scheduleChange", () => {
      this.setState({
        schedule: TechnicianData.getShiftSchedule()
      });
    });
  }
  styles = {
    table: {
      width: "100%",
      border: "1px solid #00acc1",
      borderRadius: "4px"
    },
    textAreaPos: {
      margin: "10px"
    },
    textAreaLabel: {
      verticalAlign: "top",
      margin: "10px"
    },
    textArea: {
      width: "500px",
      fontSize: "16px"
    },
    tableRow: {
      height: "60px"
    },
    timeInputField: {
      margin: "0 20px",
      width: "120px"
    },
    tableHeaderText: {
      margin: "0 20px",
      width: "100px",
      fontSize: "16px",
      paddingLeft: "20px"
    }
  };
  handleDescriptionChange(value) {
    updateDescription(value);
  }
  changeTimeValue(index, type, value) {
    updateSchedule(index, type, value);
  }
  render() {
    return (
      <div>
        <div style={this.styles.table}>
          <List aria-label="main mailbox folders">
            <ListItem style={this.styles.tableRow}>
              <ListItemText primary="Shift Schedule (24-hour)" />
              <span style={this.styles.tableHeaderText}>From</span>
              <span style={this.styles.tableHeaderText}>To</span>
            </ListItem>
            {this.state.schedule.map((day, index) => (
              <React.Fragment key={index}>
                <ListItem style={this.styles.tableRow}>
                  <ListItemText primary={day.Day} />
                  <TextField
                    style={this.styles.timeInputField}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 23 } }}
                    value={this.state.schedule[index]["FromTime"]}
                    onChange={event =>
                      this.changeTimeValue(
                        index,
                        "FromTime",
                        event.target.value
                      )
                    }
                    variant="outlined"
                  />
                  <TextField
                    style={this.styles.timeInputField}
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: this.state.schedule[index]["FromTime"],
                        max: 23
                      }
                    }}
                    value={this.state.schedule[index]["EndTime"]}
                    onChange={event =>
                      this.changeTimeValue(index, "EndTime", event.target.value)
                    }
                    variant="outlined"
                  />
                </ListItem>
                {index !== this.state.schedule.length - 1 ? <Divider /> : null}
              </React.Fragment>
            ))}
          </List>
        </div>
        <div style={this.styles.textAreaPos}>
          <span style={this.styles.textAreaLabel}>Description:</span>
          <TextareaAutosize
            rowsMin={4}
            style={this.styles.textArea}
            value={this.state.description}
            onChange={event => this.handleDescriptionChange(event.target.value)}
          />
        </div>
      </div>
    );
  }
}

export default TableAndDescription;
