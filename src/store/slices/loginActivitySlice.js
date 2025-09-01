import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import loginActivityService from '../../services/loginActivityService';


export const fetchloginActivity = createAsyncThunk(
    'loginActivity/fetchloginActivity',
    async (_, { rejectWithValue }) => {
        try {
            const response = await loginActivityService.loginActivity();
            console.log("Fetched login activity:", response.data.data.login_activities);
            return response.data.data.login_activities; // Adjusted to match your API response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)
const loginActivitySlice = createSlice({
    name: 'loginActivity',
    initialState: {
        loginActivity: [],
        loading: false,
        error: null,
        currentloginActivity: null
    },
    reducers: {
        setCurrentloginActivity: (state, action) => {
            state.currentloginActivity = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetLoginActivity: (state) => {
            state.loginActivity = [];
            state.error = null;
            state.loading = false;
            state.currentloginActivity = null;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchloginActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchloginActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.loginActivity = action.payload;
            })
            .addCase(fetchloginActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },

})

export const { setCurrentloginActivity, clearError } = loginActivitySlice.actions;
export default loginActivitySlice.reducer;