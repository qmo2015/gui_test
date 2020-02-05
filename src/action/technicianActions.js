import dispatcher from "../dispatcher";

// this is the dispatcher file used to modified data in technicianData.js
export function updateShiftType(shiftType) {
  dispatcher.dispatch({
    type: "UPDATE_SHIFT_TYPE",
    shiftType
  });
}

export function updateSelectedTechnician(technician) {
  dispatcher.dispatch({
    type: "UPDATE_SELECTED_TECHNICIAN",
    technician
  });
}

export function updateSearchTerm(term) {
  dispatcher.dispatch({
    type: "UPDATE_SEARCH_TERM",
    term
  });
}

export function updateNameField(name) {
  dispatcher.dispatch({
    type: "UPDATE_NAME_FIELD",
    name
  });
}

export function updateExpirationDate(date) {
  dispatcher.dispatch({
    type: "UPDATE_EXPIRATION_DATE",
    date
  });
}

export function updateDescription(value) {
  dispatcher.dispatch({
    type: "UPDATE_DESCRIPTION",
    value
  });
}

export function updateSchedule(index, timeType, value) {
  dispatcher.dispatch({
    type: "UPDATE_SCHEDULE",
    index,
    timeType,
    value
  });
}

export function addOrEditTechnician() {
  dispatcher.dispatch({
    type: "ADD_OR_EDIT_TECHNICIAN"
  });
}

export function deleteTechnician(id) {
  dispatcher.dispatch({
    type: "DELETE_TECHNICIAN",
    id
  });
}

export function downLoadList() {
  dispatcher.dispatch({
    type: "DOWNLOAD_LIST"
  });
}
