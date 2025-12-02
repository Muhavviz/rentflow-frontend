import { configureStore } from "@reduxjs/toolkit";
import buildingReducer from "../slices/building-slice";
import unitsReducer from "../slices/units-slice";

const createStore = () => {
  return configureStore({
    reducer: {
      buildings: buildingReducer,
      units: unitsReducer,
    },
  });
};

export default createStore;