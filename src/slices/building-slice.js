import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchBuildings = createAsyncThunk('buildings/fetchBuildings', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/buildings', { headers: { Authorization: localStorage.getItem('token') } });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

export const createBuilding = createAsyncThunk('buildings/createBuilding', async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/buildings', formData, { headers: { Authorization: localStorage.getItem('token') } });
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const updateBuilding = createAsyncThunk('buildings/updateBuilding', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/buildings/${id}`, formData, { headers: { Authorization: localStorage.getItem('token') } });
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

const buildingSlice = createSlice({
    name: 'buildings',
    initialState: {
        data: [],
        isLoading: false,
        serverError: null,
        editId: null
    },
    reducers: {
        resetBuildings: (state) => {
            state.data = [];
            state.isLoading = false;
            state.serverError = null;
        },
        setEditId: (state, action) => {
            state.editId = action.payload;
        },
        clearEditId: (state) => {
            state.editId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuildings.pending, (state) => {
                state.isLoading = true;
                state.serverError = null
            })
            .addCase(fetchBuildings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload
            })
            .addCase(fetchBuildings.rejected, (state, action) => {
                state.isLoading = false;
                state.serverError = action.payload;
            })
            .addCase(createBuilding.pending, (state) => {
                state.isLoading = true;
                state.serverError = null
            })
            .addCase(createBuilding.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.push(action.payload);
            })
            .addCase(createBuilding.rejected, (state, action) => {
                state.isLoading = false;
                state.serverError = action.payload
            })
            .addCase(updateBuilding.pending, (state) => {
                state.isLoading = true;
                state.serverError = null
            })
            .addCase(updateBuilding.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.data.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
                state.editId = null;
            })
            .addCase(updateBuilding.rejected, (state, action) => {
                state.isLoading = false;
                state.serverError = action.payload
            })
    }
});

export const { resetBuildings, setEditId, clearEditId } = buildingSlice.actions;

export default buildingSlice.reducer;