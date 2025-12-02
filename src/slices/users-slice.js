import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const searchTenant = createAsyncThunk(
  "users/searchTenant",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/search", {
        params: { email },
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Tenant not found" });
    }
  }
);

export const createTenant = createAsyncThunk(
  "users/createTenant",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/tenants", formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "users/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/dashboard/stats", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    searchedTenant: null,
    isLoading: false,
    serverError: null,
    dashboardStats: null,
    statsLoading: false,
    statsError: null,
  },
  reducers: {
    clearSearchedTenant: (state) => {
      state.searchedTenant = null;
      state.serverError = null;
    },
    resetUserError: (state) => {
      state.serverError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTenant.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(searchTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedTenant = action.payload;
        state.serverError = null;
      })
      .addCase(searchTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.searchedTenant = null;
        state.serverError = action.payload;
      })
      .addCase(createTenant.pending, (state) => {
        state.isLoading = true;
        state.serverError = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedTenant = action.payload;
        state.serverError = null;
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.serverError = action.payload;
      })
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.dashboardStats = action.payload;
        state.statsError = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      });
  },
});

export const { clearSearchedTenant, resetUserError } = usersSlice.actions;

export default usersSlice.reducer;

