import { configureStore } from "@reduxjs/toolkit";
import buildingReducer from "../slices/building-slice";
import unitsReducer from "../slices/units-slice";
import agreementReducer from "../slices/agreement-slice";
import usersReducer from "../slices/users-slice";

const createStore = () => {
  return configureStore({
    reducer: {
      buildings: buildingReducer,
      units: unitsReducer,
      agreements: agreementReducer,
      users: usersReducer,
    },
  });
};

export default createStore;