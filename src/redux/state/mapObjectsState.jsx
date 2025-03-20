import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const API_BASE_URL = "https://localhost:7176/api";

export const getAllObjects = createAsyncThunk(
    'objects/getAllObjects',
    async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Points`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching objects:', error);
            throw error;
        }
    }
);

export const addFeature = createAsyncThunk(
    'objects/addFeature',
    async (pointData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Points`, pointData);
            return response.data;
        } catch (error) {
            console.error('Error adding point:', error);
            throw error;
        }
    }
);

export const addLineString = createAsyncThunk(
    'objects/addLineString',
    async (lineStringData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Points`, lineStringData);
            return response.data;
        } catch (error) {
            console.error('Error adding linestring:', error);
            throw error;
        }
    }
);

export const addPolygon = createAsyncThunk(
    'objects/addPolygon',
    async (polygonData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Points`, polygonData);
            return response.data;
        } catch (error) {
            console.error('Error adding polygon:', error);
            throw error;
        }
    }
);

export const deleteFeature = createAsyncThunk(
    'objects/deleteFeature',
    async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/Points/${id}`);
            return id;
        } catch (error) {
            console.error('Error deleting feature:', error);
            throw error;
        }
    }
);

export const updateFeature = createAsyncThunk(
    'objects/updateFeature',
    async ({ id, data }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/Points/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating feature:', error);
            throw error;
        }
    }
);

const initialState = {
    objects: [],
    loading: false
}
export const objectSlice = createSlice({
    name: "object",
    initialState,
    reducers:{
    },
    extraReducers : (builder) => {
        builder
        .addCase(getAllObjects.fulfilled, (state, action)=> {
            state.objects = action.payload;
        })
        .addCase(addFeature.fulfilled, (state, action) => {
            state.objects.push(action.payload);
            
        })
        .addCase(deleteFeature.fulfilled, (state, action) => {
            state.objects = state.objects.filter(obj => obj.id !== action.payload);
        })
        .addCase(updateFeature.fulfilled, (state, action) => {
                const index = state.objects.findIndex(obj => obj.id === action.payload.id);
                if (index !== -1) {
                    state.objects[index] = action.payload;
                }
        })
    }
})

export const { } = objectSlice.actions
export default objectSlice.reducer