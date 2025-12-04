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

export const updateAgreement = createAsyncThunk(
  "agreements/updateAgreement",
  async ({ agreementId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/agreements/${agreementId}`, formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const terminateAgreement = createAsyncThunk(
  "agreements/terminateAgreement",
  async (agreementId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/agreements/${agreementId}/terminate`, {}, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const fetchMyResidences = createAsyncThunk(
  "agreements/fetchMyResidences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/tenant/agreements", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const fetchAgreementsByOwner = createAsyncThunk(
  "agreements/fetchByOwner",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/agreements", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data || [];
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
    myResidences: [],
    ownerAgreements: [],
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
        state.isLoading = false;
        const { unitId, agreements } = action.payload;
        state.agreementsByUnitId[unitId] = agreements;
      })
      .addCase(fetchAgreementsByUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(updateAgreement.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(updateAgreement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serverError = null;
        
        const updatedAgreement = action.payload;
        if (updatedAgreement) {
          const unitId = typeof updatedAgreement.unit === 'object' 
            ? updatedAgreement.unit._id || updatedAgreement.unit 
            : updatedAgreement.unit;
          
          if (unitId && state.agreementsByUnitId[unitId]) {
            const index = state.agreementsByUnitId[unitId].findIndex(
              (a) => a._id === updatedAgreement._id
            );
            if (index !== -1) {
              state.agreementsByUnitId[unitId][index] = updatedAgreement;
            }
          }
        }
      })
      .addCase(updateAgreement.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(terminateAgreement.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(terminateAgreement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serverError = null;
        
        const terminatedAgreement = action.payload;
        if (terminatedAgreement) {
          const unitId = typeof terminatedAgreement.unit === 'object' 
            ? terminatedAgreement.unit._id || terminatedAgreement.unit 
            : terminatedAgreement.unit;
          
          if (unitId && state.agreementsByUnitId[unitId]) {
            const index = state.agreementsByUnitId[unitId].findIndex(
              (a) => a._id === terminatedAgreement._id
            );
            if (index !== -1) {
              state.agreementsByUnitId[unitId][index] = {
                ...state.agreementsByUnitId[unitId][index],
                status: 'terminated',
                isActive: false
              };
            }
          }
        }
      })
      .addCase(terminateAgreement.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(fetchMyResidences.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(fetchMyResidences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serverError = null;
        state.myResidences = action.payload;
      })
      .addCase(fetchMyResidences.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(fetchAgreementsByOwner.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(fetchAgreementsByOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serverError = null;
        state.ownerAgreements = action.payload;
      })
      .addCase(fetchAgreementsByOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      });
  },
});

export const { resetAgreementError } = agreementSlice.actions;

export default agreementSlice.reducer;

