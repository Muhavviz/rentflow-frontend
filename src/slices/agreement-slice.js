import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const createAgreement = createAsyncThunk(
  "agreements/createAgreement",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/agreements", formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const fetchAgreementsByUnit = createAsyncThunk(
  "agreements/fetchByUnit",
  async (unitId, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/agreements", {
        params: { unitId },
        headers: { Authorization: localStorage.getItem("token") },
      });
      return { unitId, agreements: response.data || [] };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

const agreementSlice = createSlice({
  name: "agreements",
  initialState: {
    isLoading: false,
    serverError: null,
    agreementsByUnitId: {},
  },
  reducers: {
    resetAgreementError: (state) => {
      state.serverError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAgreement.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(createAgreement.fulfilled, (state) => {
        state.isLoading = false;
        state.serverError = null;
      })
      .addCase(createAgreement.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(fetchAgreementsByUnit.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(fetchAgreementsByUnit.fulfilled, (state, action) => {
        const { unitId, agreements } = action.payload;
        state.agreementsByUnitId[unitId] = agreements;
      })
      .addCase(fetchAgreementsByUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      });
  },
});

export const { resetAgreementError } = agreementSlice.actions;

export default agreementSlice.reducer;

