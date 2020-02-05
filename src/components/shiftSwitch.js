import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TechnicianData from "../store/technicianData";
import { updateShiftType } from "../action/technicianActions";

// switch to select regular or extra shift
class ShiftSwitch extends Component {
  constructor() {
    super();
    this.state = {
      shiftOptions: TechnicianData.getShiftData().shiftOptions, // options
      selectedShiftType: TechnicianData.getShiftData().selectedShiftType // the shift type selected
    };
  }
  styles = {
    shiftButton: {
      padding: "5px 70px",
      borderColor: "#00acc1",
      color: "#00acc1"
    },
    shiftButtonSelected: {
      padding: "5px 70px",
      borderColor: "#00acc1",
      background: "#00acc1",
      color: "#ffffff"
    }
  };
  selectShiftType(shiftType) {
    updateShiftType(shiftType);
  }
  componentDidMount() {
    TechnicianData.on("ShiftTypeChange", () => {
      this.setState({
        selectedShiftType: TechnicianData.getShiftData().selectedShiftType
      });
    });
  }
  render() {
    return (
      <ButtonGroup aria-label="outlined primary button group">
        {this.state.shiftOptions.map(shiftType => (
          <Button
            key={shiftType}
            style={
              this.state.selectedShiftType === shiftType
                ? this.styles.shiftButtonSelected
                : this.styles.shiftButton
            }
            onClick={() => this.selectShiftType(shiftType)}
          >
            {shiftType}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}

export default ShiftSwitch;
