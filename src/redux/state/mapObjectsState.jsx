import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { vectorSource } from "../../utils/MapView";
import WKT from "ol/format/WKT";
import Feature from "ol/Feature";

const API_BASE_URL = "https://localhost:7176/api";

export const getFilteredObjects = createAsyncThunk(
    'objects/getFilteredObjects',
    async () => {
      const response = await axios.get("https://localhost:7176/api/Points/filtered", {
        withCredentials: true
      });
      return response.data.value || [];
    }
  );  

export const addFeature = createAsyncThunk(
    'objects/addFeature',
    async (pointData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Points`, pointData, {
                withCredentials: true
              });              
            return response.data.value;
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
            const response = await axios.post(`${API_BASE_URL}/Points`, lineStringData, {
                withCredentials: true
              });
              
            return response.data.value;
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
            const response = await axios.post(`${API_BASE_URL}/Points`, polygonData, {
                withCredentials: true
              });
              return response.data.value;
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
            await axios.delete(`${API_BASE_URL}/Points/${id}`, {
                withCredentials: true
            });
            return id;
        } catch (error) {
            console.error('Error deleting feature:', error);
            throw error;
        }
    }
);

export const updateFeature = createAsyncThunk(
    'objects/updateFeature',
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/Points/${id}`, data, {
          withCredentials: true
        });
        console.log("Backend response:", response.data);
        return response.data.value;
      } catch (error) {
        console.error("Update error:", error);
        return rejectWithValue(error.response?.data || "Update error");
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
    reducers: {
        clearObjects: (state) => {
          state.objects = [];
        },
    },      
    extraReducers : (builder) => {
        builder
        .addCase(getFilteredObjects.fulfilled, (state, action)=> {
            state.objects = action.payload;
        })
        .addCase(addFeature.fulfilled, (state, action) => {
            state.objects.push(action.payload);
          
            const wktFormat = new WKT();
            const geometry = wktFormat.readGeometry(action.payload.wkt);
            geometry.transform('EPSG:4326', 'EPSG:3857');
          
            const feature = new Feature({
              geometry: geometry,
              pointData: action.payload
            });
            feature.setId(action.payload.id);
            vectorSource.addFeature(feature);
          })
          .addCase(addLineString.fulfilled, (state, action) => {
            state.objects.push(action.payload);
          
            const wktFormat = new WKT();
            const geometry = wktFormat.readGeometry(action.payload.wkt);
            geometry.transform('EPSG:4326', 'EPSG:3857');
          
            const feature = new Feature({
              geometry: geometry,
              pointData: action.payload
            });
            feature.setId(action.payload.id);
            vectorSource.addFeature(feature);
          })
          .addCase(addPolygon.fulfilled, (state, action) => {
            state.objects.push(action.payload);
          
            const wktFormat = new WKT();
            const geometry = wktFormat.readGeometry(action.payload.wkt);
            geometry.transform('EPSG:4326', 'EPSG:3857');
          
            const feature = new Feature({
              geometry: geometry,
              pointData: action.payload
            });
            feature.setId(action.payload.id);
            vectorSource.addFeature(feature);
          })
          
        .addCase(deleteFeature.fulfilled, (state, action) => {
            state.objects = state.objects.filter(obj => obj.id !== action.payload);
        })
        .addCase(updateFeature.fulfilled, (state, action) => {
            const updated = action.payload;
            if (!updated || !updated.id) return;
        
            const index = state.objects.findIndex(obj => obj.id === updated.id);
            if (index !== -1) {
                state.objects[index] = updated;
            }
        })             
    }
})

export const { clearObjects } = objectSlice.actions;
export default objectSlice.reducer