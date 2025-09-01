import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PackagesService from '../../services/packagesService';

export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await PackagesService.getAll();
      return response.data.data.packages; // Adjusted to match your API response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await PackagesService.create(packageData);
      return response.data.package; // Adjusted to match your API response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, packageData }, { rejectWithValue }) => {
    try {
      const response = await PackagesService.update(id, packageData);
      return response.data.package;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletePackage = createAsyncThunk(
  'packages/deletePackage',
  async (id, { rejectWithValue }) => {
    try {
      await PackagesService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const packagesSlice = createSlice({
  name: 'packages',
  initialState: {
    packages: [],
    loading: false,
    error: null,
    currentPackage: null
  },
  reducers: {
    setCurrentPackage: (state, action) => {
      state.currentPackage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Packages
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Package
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.push(action.payload);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter(pkg => pkg.id !== action.payload);
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentPackage, clearError } = packagesSlice.actions;
export default packagesSlice.reducer;