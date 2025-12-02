import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchUnitsByBuilding = createAsyncThunk(
  "units/fetchByBuilding",
  async (buildingId, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/units", {
        params: { buildingId },
        headers: { Authorization: localStorage.getItem("token") },
      });
      return { buildingId, units: response.data.units || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const createUnit = createAsyncThunk(
  "units/createUnit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/units", formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const updateUnit = createAsyncThunk(
  "units/updateUnit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/units/${id}`, formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

const unitsSlice = createSlice({
  name: "units",
  initialState: {
    dataByBuildingId: {},
    isLoading: false,
    serverError: null,
  },
  reducers: {
    resetUnits: (state) => {
      state.dataByBuildingId = {};
      state.isLoading = false;
      state.serverError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitsByBuilding.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(fetchUnitsByBuilding.fulfilled, (state, action) => {
        state.isLoading = false;
        const { buildingId, units } = action.payload;
        state.dataByBuildingId[buildingId] = units;
      })
      .addCase(fetchUnitsByBuilding.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(createUnit.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        const unit = action.payload;
        const buildingId = unit.building;
        if (!state.dataByBuildingId[buildingId]) {
          state.dataByBuildingId[buildingId] = [];
        }
        state.dataByBuildingId[buildingId].push(unit);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(updateUnit.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUnit = action.payload;
        const buildingId = updatedUnit.building;
        const list = state.dataByBuildingId[buildingId];
        if (list) {
          const idx = list.findIndex((unit) => unit._id === updatedUnit._id);
          if (idx !== -1) {
            list[idx] = updatedUnit;
          }
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      });
  },
});

export const { resetUnits } = unitsSlice.actions;

export default unitsSlice.reducer;
