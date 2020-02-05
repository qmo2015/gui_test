import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import TechnicianData from "../store/technicianData";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  updateNameField,
  updateExpirationDate
} from "../action/technicianActions";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

dayjs.extend(isBetween);

const styles = theme => ({
  nameField: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00acc1"
    }
  }
});

// two input fields(name and date) components
class NameAndDate extends Component {
  constructor() {
    super();
    this.state = {
      selectedTechnician: TechnicianData.getSelectedTechnician(),
      nameFieldValue: TechnicianData.getSelectedTechnician()["Tech Lead"] || "",
      expirationDate: TechnicianData.getFormDate(),
      showNameError: false,
      showDateError: false
    };
  }
  styles = {
    datePickerPos: {
      marginTop: "300px"
    }
  };
  componentDidMount() {
    TechnicianData.on("selectedTechnicianChange", () => {
      this.setState({
        selectedTechnician: TechnicianData.getSelectedTechnician(),
        nameFieldValue:
          TechnicianData.getSelectedTechnician()["Tech Lead"] || ""
      });
    });
    TechnicianData.on("expirationDateChange", () => {
      this.setState({
        expirationDate: TechnicianData.getFormDate()
      });
    });
    TechnicianData.on("noValidDate", () => {
      this.setState({
        showDateError: true
      });
    });
    TechnicianData.on("emptyName", () => {
      this.setState({
        showNameError: true
      });
    });
  }
  changeNameValue(name) {
    this.setState({
      nameFieldValue: name
    });
    updateNameField(name);
  }
  resetNameValidate() {
    // reset the error message
    this.setState({
      showNameError: false
    });
  }
  resetDateValidate() {
    // reset the error message
    this.setState({
      showDateError: false
    });
  }
  handleDateChange(date) {
    this.setState({
      showDateError: false
    });
    if (
      dayjs(date).isValid() && // check if the date format is valid and if the date is in the date picker's default range
      dayjs(date).isBetween("1900-01-01", "2100-10-30", null, "[]")
    ) {
      updateExpirationDate(dayjs(date).format("MM/DD/YYYY"));
    } else {
      updateExpirationDate("invalid");
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.selectedTechnician === "" ? (
          <p>New Tech Lead</p>
        ) : (
          <p>Tech Lead ID:{this.state.selectedTechnician.id}</p>
        )}
        <TextField
          onFocus={() => this.resetNameValidate()}
          error={this.state.showNameError}
          helperText={this.state.showNameError ? "name is required" : ""}
          className={classes.nameField}
          label="Name"
          variant="outlined"
          value={this.state.nameFieldValue}
          onChange={event => this.changeNameValue(event.target.value)}
        />
        <div style={this.styles.datePickerPos}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              onFocus={() => this.resetDateValidate()}
              error={this.state.showDateError}
              helperText={
                this.state.showDateError
                  ? "valid date is required (01/01/1900 - 01/01/2100)"
                  : ""
              }
              margin="normal"
              className={classes.nameField}
              label="Expiration Date"
              format="MM/dd/yyyy"
              inputVariant="outlined"
              value={this.state.expirationDate}
              onChange={event => this.handleDateChange(event)}
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>
    );
  }
}
NameAndDate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NameAndDate);
