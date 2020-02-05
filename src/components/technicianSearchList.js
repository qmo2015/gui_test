import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import TechnicianData from "../store/technicianData";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import {
  updateSelectedTechnician,
  updateSearchTerm,
  deleteTechnician,
  downLoadList
} from "../action/technicianActions";

// search field and the complete list
class TechnicianSearchList extends Component {
  constructor() {
    super();
    this.state = {
      technicianSearchList: TechnicianData.getTechnicianSearchList(),
      selectedTechnicianId: TechnicianData.getSelectedTechnician().id,
      technicianCompleteList: TechnicianData.getTechnicianCompleteList(),
      showSearchResults: false
    };
  }
  styles = {
    container: {
      margin: "auto",
      width: "320px"
    },
    technicianList: {
      maxHeight: "400px",
      minHeight: "300px",
      overflow: "hidden auto",
      border: "solid 1px #00acc1",
      borderRadius: "4px",
      width: "300px"
    },
    technicianListItem: {
      width: "300px"
    },
    technicianListItemSelected: {
      background: "#00acc1",
      color: "#ffffff",
      width: "300px"
    },
    search: {
      position: "relative",
      borderRadius: "4px",
      border: "1px #00acc1 solid",
      marginLeft: 0,
      width: "280px",
      boxSizing: "border-box",
      height: "40px",
      lineHeight: "40px",
      paddingLeft: "40px",
      marginBottom: "40px"
    },
    searchResults: {
      width: "280px",
      minHeight: "40px",
      maxHeight: "400px",
      overflow: "hidden auto",
      position: "absolute",
      left: "-1px",
      zIndex: "100"
    },
    searchIcon: {
      height: "100%",
      position: "absolute",
      left: "10px",
      color: "#00acc1"
    },
    newBtn: {
      padding: "5px 20px",
      borderColor: "#00acc1",
      background: "#00acc1",
      color: "#ffffff",
      margin: "10px 10px 0"
    },
    deleteBtn: {
      padding: "5px 20px",
      margin: "10px 10px 0 10px"
    },
    downloadBtn: {
      border: "1px #00796b solid",
      color: "#00796b",
      background: "#ffffff",
      margin: "10px"
    }
  };
  componentDidMount() {
    let that = this;
    document.addEventListener("click", function(e) {
      // a click listener that makes the search results disappear if a user clicks on anywhere on the page
      that.setState({
        showSearchResults: false
      });
    });
    TechnicianData.on("selectedTechnicianChange", () => {
      this.setState({
        selectedTechnicianId: TechnicianData.getSelectedTechnician().id
      });
    });
    TechnicianData.on("searchTermChange", () => {
      this.setState({
        technicianSearchList: TechnicianData.getTechnicianSearchList()
      });
    });
  }
  selectTechnician(technician = "") {
    // load a technician from the list or from the test results
    updateSelectedTechnician(technician);
  }

  deleteTechnician(id) {
    deleteTechnician(id);
    this.selectTechnician();
  }

  suggestSearch(searchTerm) {
    // get search results
    this.setState({
      showSearchResults: true
    });
    updateSearchTerm(searchTerm);
  }

  render() {
    return (
      <div style={this.styles.container}>
        <div style={this.styles.search}>
          <div>
            <SearchIcon style={this.styles.searchIcon} />
            <InputBase
              placeholder="Search Tech Lead…"
              onChange={event => this.suggestSearch(event.target.value)}
            />
            {this.state.technicianSearchList.length &&
            this.state.showSearchResults ? (
              <Card style={this.styles.searchResults} id="searchResults">
                <List component="nav" aria-label="main mailbox folders">
                  {this.state.technicianSearchList.map((technician, index) => (
                    <ListItem
                      style={this.styles.technicianListItem}
                      button
                      onClick={() => this.selectTechnician(technician)}
                      key={index}
                    >
                      <ListItemText primary={technician["Tech Lead"]} />
                    </ListItem>
                  ))}
                </List>
              </Card>
            ) : null}
          </div>
        </div>
        <div>
          <div style={this.styles.technicianList}>
            {this.state.technicianCompleteList.length > 0 ? (
              <List component="nav">
                {this.state.technicianCompleteList.map((technician, index) => (
                  <ListItem
                    style={
                      this.state.selectedTechnicianId === technician["id"]
                        ? this.styles.technicianListItemSelected
                        : this.styles.technicianListItem
                    }
                    button
                    onClick={() => this.selectTechnician(technician)}
                    key={index}
                  >
                    <ListItemText primary={technician["Tech Lead"]} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <List component="nav">
                <ListItem>
                  <ListItemText primary="No Tech Lead Added" />
                </ListItem>
              </List>
            )}
          </div>
        </div>
        <Button
          variant="contained"
          style={this.styles.newBtn}
          onClick={() => this.selectTechnician()}
        >
          New Tech Lead
        </Button>
        {this.state.selectedTechnicianId ? (
          <Button
            variant="contained"
            style={this.styles.deleteBtn}
            color="secondary"
            onClick={() =>
              this.deleteTechnician(this.state.selectedTechnicianId)
            }
          >
            Delete Tech Lead
          </Button>
        ) : null}
        <Button style={this.styles.downloadBtn} onClick={() => downLoadList()}>
          Download list (json file)
        </Button>
      </div>
    );
  }
}

export default TechnicianSearchList;
