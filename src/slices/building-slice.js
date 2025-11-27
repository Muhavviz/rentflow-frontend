import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchBuilding = createAsyncThunk('buildings/fetchBuildings',async(_,{rejectWithValue}) => {
    try {
        const response = await axios.get('/api/buildings', {headers:{Authorization:localStorage.getItem('token')}});
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

const buildingSlice = createSlice({
    name:'buildings',
    initialState:{
        data:[],
        isLoading:false,
        serverError:null
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchBuilding.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchBuilding.fulfilled, (state,action) => {
            state.isLoading = false;
            state.data = action.payload
        })
        .addCase(fetchBuilding.rejected, (state,action) => {
            state.isLoading = false;
            state.serverError = action.payload;
        })
    }
});

export default buildingSlice.reducer;