import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import dayjs from "dayjs";
const download = require("downloadjs");

// manages all the data including the user input form data and the list of technician
class TechnicianData extends EventEmitter {
  constructor() {
    super();
    this.shiftOptions = ["Regular", "Extra"]; // shift type options
    this.searchTerm = ""; // search term in the search field
    this.formProgress = 25; // default completion value set at 25 because the expiration date is set at current day by default
    this.selectedTechnician = ""; // the technician selected from the right list or from the search results
    this.hasValidDate = true; // if user entered a valid date
    this.formData = {
      "Tech Lead": "",
      "Expiration Date": dayjs().format("MM/DD/YYYY"),
      Description: "",
      ShiftType: "Regular",
      ShiftDetails: [
        {
          Day: "Monday",
          FromTime: "",
          EndTime: ""
        },
        {
          Day: "Tuesday",
          FromTime: "",
          EndTime: ""
        },
        {
          Day: "Wednesday",
          FromTime: "",
          EndTime: ""
        },
        {
          Day: "Thursday",
          FromTime: "",
          EndTime: ""
        },
        {
          Day: "Friday",
          FromTime: "",
          EndTime: ""
        },
        {
          Day: "Saturday",
          FromTime: "",
          EndTime: ""
        },
        {
          Day: "Sunday",
          FromTime: "",
          EndTime: ""
        }
      ]
    };
    this.technicianCompleteList = []; // list of technician data
    this.listJson = JSON.stringify([]); // data stored in JSON format
  }
  validateNameAndDate() {
    // validate required value name and date
    if (!this.hasValidDate) {
      this.emit("noValidDate");
    }
    if (this.formData["Tech Lead"] === "") {
      this.emit("emptyName");
    } else if (this.hasValidDate) {
      this.addOrEditTechnician();
    }
  }

  updateShiftType(shiftType) {
    this.formData.ShiftType = shiftType;
    this.emit("ShiftTypeChange");
  }

  updateSelectedTechician(technician) {
    this.selectedTechnician = technician;
    if (technician === "") {
      this.formData["Tech Lead"] = "";
      this.formData.ShiftType = "Regular";
      this.formData["Expiration Date"] = dayjs().format("MM/DD/YYYY");
      this.formData.Description = "";
      this.formData.ShiftDetails.map(e => {
        e.FromTime = "";
        e.EndTime = "";
        return 0;
      });
    } else {
      this.formData["Tech Lead"] = technician["Tech Lead"];
      this.formData.ShiftType = technician.ShiftType;
      this.formData["Expiration Date"] = technician["Expiration Date"];
      this.formData.Description = technician.Description;
      this.formData.ShiftDetails.map((e, index) => {
        e.FromTime = technician.ShiftDetails[index].FromTime.split(":")[0];
        e.EndTime = technician.ShiftDetails[index].EndTime.split(":")[0];
        return 0;
      });
    }
    this.emit("selectedTechnicianChange");
    this.emit("ShiftTypeChange");
    this.emit("expirationDateChange");
    this.emit("descriptionChange");
    this.emit("scheduleChange");
    this.emit("formProgressChange");
  }

  updateSearchTerm(term) {
    this.searchTerm = term;
    this.emit("searchTermChange");
  }

  updateNameField(name) {
    this.formData["Tech Lead"] = name;
    this.emit("nameValueChange");
    this.emit("formProgressChange");
  }

  updateExpirationDate(date) {
    if (date === "invalid") {
      this.hasValidDate = false;
    } else {
      this.hasValidDate = true;
      this.formData["Expiration Date"] = date;
      this.emit("expirationDateChange");
    }
    this.emit("formProgressChange");
  }

  updateDescription(value) {
    this.formData.Description = value;
    this.emit("descriptionChange");
    this.emit("formProgressChange");
  }

  updateSchedule(index, type, value) {
    value = value > 23 ? 23 : value;
    value = value < 0 ? 0 : value;
    this.formData.ShiftDetails[index][type] = value;
    if (
      type === "FromTime" &&
      this.formData.ShiftDetails[index].EndTime !== "" &&
      parseInt(value) > parseInt(this.formData.ShiftDetails[index].EndTime)
    ) {
      this.formData.ShiftDetails[index].EndTime = value;
    }
    if (
      type === "EndTime" &&
      this.formData.ShiftDetails[index].FromTime !== "" &&
      parseInt(value) < parseInt(this.formData.ShiftDetails[index].FromTime)
    ) {
      this.formData.ShiftDetails[index].FromTime = value;
    }
    this.emit("scheduleChange");
    this.emit("formProgressChange");
  }

  getShiftSchedule() {
    return this.formData.ShiftDetails;
  }

  addOrEditTechnician() {
    // add new technician object to the list of technician or edit a current one
    if (this.selectedTechnician === "") {
      let newTechnician = {
        id: new Date().getTime().toString(),
        ShiftType: this.formData.ShiftType,
        "Tech Lead": this.formData["Tech Lead"],
        "Expiration Date": this.formData["Expiration Date"],
        Description: this.formData.Description
      };
      let schedule = [];
      this.formData.ShiftDetails.map(e => {
        schedule.push({
          Day: e.Day,
          FromTime: `${e.FromTime !== "" ? e.FromTime + ":00" : ""}`,
          EndTime: `${e.EndTime !== "" ? e.EndTime + ":00" : ""}`
        });
        return 0;
      });
      newTechnician.ShiftDetails = schedule;
      this.technicianCompleteList.push(newTechnician);
    } else {
      let id = this.selectedTechnician.id;
      let index = this.technicianCompleteList.findIndex(e => e.id === id);
      this.technicianCompleteList[index]["Tech Lead"] = this.formData[
        "Tech Lead"
      ];
      this.technicianCompleteList[index]["Expiration Date"] = this.formData[
        "Expiration Date"
      ];
      this.technicianCompleteList[index].ShiftType = this.formData.ShiftType;
      this.technicianCompleteList[
        index
      ].Description = this.formData.Description;
      let schedule = [];
      this.formData.ShiftDetails.map(e => {
        schedule.push({
          Day: e.Day,
          FromTime: `${e.FromTime !== "" ? e.FromTime + ":00" : ""}`,
          EndTime: `${e.EndTime !== "" ? e.EndTime + ":00" : ""}`
        });
        return 0;
      });
      this.technicianCompleteList[index].ShiftDetails = schedule;
    }
    this.listJson = JSON.stringify(this.technicianCompleteList); // store list in JSON format
    this.updateSelectedTechician("");
  }

  deleteTechnician(id) {
    // remove a technician object from the list
    let index = this.technicianCompleteList.findIndex(e => e.id === id);
    this.technicianCompleteList.splice(index, 1);
  }

  downloadList() {
    // output the JSON file for download
    download(this.listJson, "technicianShift.json", "json");
  }

  calculateProgress() {
    // calculate the progress upon each uesr input
    let progress = 0;
    progress += this.formData["Tech Lead"] === "" ? 0 : 25;
    progress += this.hasValidDate ? 25 : 0;
    progress += this.formData.Description === "" ? 0 : 25;
    let scheduleCompleted = true;
    for (let i = 0; i < this.formData.ShiftDetails.length; i++) {
      if (
        this.formData.ShiftDetails[i].FromTime === "" ||
        this.formData.ShiftDetails[i].EndTime === ""
      ) {
        scheduleCompleted = false;
        break;
      }
    }
    progress += scheduleCompleted ? 25 : 0;
    this.formProgress = progress;
  }

  getFormProgress() {
    this.calculateProgress();
    return this.formProgress;
  }

  getDescription() {
    return this.formData.Description;
  }

  getShiftData() {
    return {
      shiftOptions: this.shiftOptions,
      selectedShiftType: this.formData.ShiftType
    };
  }

  getFormDate() {
    return this.formData["Expiration Date"];
  }

  getSelectedTechnician() {
    return this.selectedTechnician;
  }

  getTechnicianCompleteList() {
    return this.technicianCompleteList;
  }

  getTechnicianSearchList() {
    let technicianSearchList = [];
    if (this.searchTerm.trim() !== "") {
      this.technicianCompleteList.map(e => {
        if (e["Tech Lead"].toLocaleLowerCase().includes(this.searchTerm)) {
          technicianSearchList.push(e);
        }
        return 0;
      });
    }
    return technicianSearchList;
  }

  handleActions(action) {
    switch (action.type) {
      case "UPDATE_SHIFT_TYPE":
        this.updateShiftType(action.shiftType);
        break;
      case "UPDATE_SELECTED_TECHNICIAN":
        this.updateSelectedTechician(action.technician);
        break;
      case "UPDATE_SEARCH_TERM":
        this.updateSearchTerm(action.term);
        break;
      case "UPDATE_NAME_FIELD":
        this.updateNameField(action.name);
        break;
      case "UPDATE_EXPIRATION_DATE":
        this.updateExpirationDate(action.date);
        break;
      case "UPDATE_DESCRIPTION":
        this.updateDescription(action.value);
        break;
      case "ADD_OR_EDIT_TECHNICIAN":
        this.validateNameAndDate();
        break;
      case "DELETE_TECHNICIAN":
        this.deleteTechnician(action.id);
        break;
      case "UPDATE_SCHEDULE":
        this.updateSchedule(action.index, action.timeType, action.value);
        break;
      case "DOWNLOAD_LIST":
        this.downloadList();
        break;
      default:
        break;
    }
  }
}
const technicianData = new TechnicianData();
dispatcher.register(technicianData.handleActions.bind(technicianData));

export default technicianData;
