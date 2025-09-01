// assignedPackagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PackagesService from '../../services/packagesService';

export const fetchAssignedPackages = createAsyncThunk(
    'assignedPackages/fetchAssignedPackages',
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await PackagesService.getAssignedPackages(clientId);
            console.log(response);
            return response.data.data.assigned_packages;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const assignPackage = createAsyncThunk(
    'assignPackage',
    async (packageId, { rejectWithValue }) => {
        try {
            console.log(packageId);
            const response = await PackagesService.assignPackage(packageId);
            return response.data.data.assigned_package;
        } catch (error) {
            console.log(error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const assignedPackagesSlice = createSlice({
    name: 'assignedPackages',
    initialState: {
        assignedPackages: [],
        loading: false,
        error: null
    },
    reducers: {
        sanitizePackages: (state) => {
            state.assignedPackages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssignedPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignedPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.assignedPackages = action.payload.filter(pkg => pkg !== null);
            })
            .addCase(fetchAssignedPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Assign package cases
            .addCase(assignPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.assignedPackages.push(action.payload);
            })
            .addCase(assignPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});
export const { sanitizePackages } = assignedPackagesSlice.actions;
export default assignedPackagesSlice.reducer;