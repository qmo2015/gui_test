import React, { Component } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TechnicianData from "../store/technicianData";
import Button from "@material-ui/core/Button";
import { addOrEditTechnician } from "../action/technicianActions";

//progress bar and the submit button component
const styles = theme => ({
  progressBar: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#00acc1"
    },
    "& .MuiLinearProgress-colorPrimary": {
      backgroundColor: "#b2ebf2"
    }
  },
  submitBtn: {
    backgroundColor: "#00acc1",
    position: "absolute",
    left: "0",
    right: "0",
    margin: "auto",
    top: "30px",
    padding: "10px 40px",
    "&:hover": {
      backgroundColor: "#006064"
    }
  }
});

class ProgressAndSubmit extends Component {
  constructor() {
    super();
    this.state = {
      formProgress: TechnicianData.getFormProgress()
    };
  }
  componentDidMount() {
    TechnicianData.on("formProgressChange", () => {
      this.setState({
        formProgress: TechnicianData.getFormProgress()
      });
    });
  }
  addOrEditTechnician() {
    addOrEditTechnician();
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <LinearProgress
          variant="buffer"
          valueBuffer={0}
          value={this.state.formProgress}
          className={classes.progressBar}
        />
        <Button
          variant="contained"
          size="large"
          color="primary"
          className={classes.submitBtn}
          onClick={() => this.addOrEditTechnician()}
        >
          Submit
        </Button>
      </div>
    );
  }
}
ProgressAndSubmit.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ProgressAndSubmit);
