import { configureStore } from "@reduxjs/toolkit";
import buildingReducer from '../slices/building-slice';

const createStore = () => {
    return configureStore({
        reducer:{
            buildings: buildingReducer,
        }
    })
}

export default createStore;