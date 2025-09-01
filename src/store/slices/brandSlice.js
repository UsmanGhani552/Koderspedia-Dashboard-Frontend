import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BrandService from '../../services/brandService';


export const fetchBrands = createAsyncThunk(
    'Brands/fetchBrands',
    async (_, { rejectWithValue }) => {
        try {
            const response = await BrandService.getAll();
            return response.data.data.brands; // Adjusted to match your API response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const createBrand = createAsyncThunk(
    'Brands/createBrand',
    async (brandData, { rejectWithValue }) => {
        try {
            const response = await BrandService.create(brandData);
            if (response.data?.data?.brand) {
                return response.data.data.brand;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateBrand = createAsyncThunk(
    'Brands/updateBrand',
    async ({ id, brandData }, { rejectWithValue }) => {
        try {
            const response = await BrandService.update(id, brandData);
            if (response.data?.data?.brand) {
                return response.data.data.brand;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteBrand = createAsyncThunk(
    'Brands/deleteBrand',
    async (id, { rejectWithValue }) => {
        try {
            await BrandService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const BrandSlice = createSlice({
    name: 'brands',
    initialState: {
        brands: [],
        loading: false,
        error: null,
        currentBrand: null
    },
    reducers: {
        setCurrentBrand: (state, action) => {
            state.currentBrand = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload || []; // ✅ remove nulls
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Create Brand
            .addCase(createBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands.push(action.payload); // add new Brand to list
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Update Brand
            .addCase(updateBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBrand = action.payload;
                state.brands = state.brands.map(brand =>
                    brand.id === updatedBrand.id ? updatedBrand : brand
                );
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Brand
            .addCase(deleteBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = state.brands.filter(brand => brand.id !== action.payload);
            })
            .addCase(deleteBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },

})

export const { setCurrentBrand, clearError } = BrandSlice.actions;
export default BrandSlice.reducer;