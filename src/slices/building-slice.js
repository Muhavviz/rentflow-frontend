import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchBuildings = createAsyncThunk('buildings/fetchBuildings',async(_,{rejectWithValue}) => {
    try {
        const response = await axios.get('/api/buildings', {headers:{Authorization:localStorage.getItem('token')}});
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
})

export const createBuilding = createAsyncThunk('buildings/createBuilding',async(formData,{rejectWithValue}) => {
    try {
        const response = await axios.post('/api/buildings',formData,{headers:{Authorization:localStorage.getItem('token')}});
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data)
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
        .addCase(fetchBuildings.pending, (state) => {
            state.isLoading = true;
            state.serverError = null
        })
        .addCase(fetchBuildings.fulfilled, (state,action) => {
            state.isLoading = false;
            state.data = action.payload
        })
        .addCase(fetchBuildings.rejected, (state,action) => {
            state.isLoading = false;
            state.serverError = action.payload;
        })
        .addCase(createBuilding.pending,(state) =>{
            state.isLoading = true;
            state.serverError = null
        })
        .addCase(createBuilding.fulfilled,(state,action) => {
            state.isLoading = false;
            state.data.push(action.payload);
        })
        .addCase(createBuilding.rejected,(state,action) => {
            state.isLoading = false;
            state.serverError = action.payload
        })
    }
});

export default buildingSlice.reducer;