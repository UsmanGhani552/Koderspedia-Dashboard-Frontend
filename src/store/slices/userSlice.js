import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserService from '../../services/userService';


export const fetchUsers = createAsyncThunk(
    'Users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserService.getAll();
            return response.data.data.users; // Adjusted to match your API response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const createUser = createAsyncThunk(
    'Users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await UserService.create(userData);
            if (response.data?.data?.user) {
                return response.data.data.user;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'Users/updateUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await UserService.update(id, userData);
            if (response.data?.data?.user) {
                return response.data.data.user;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'Users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await UserService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const UserSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
        currentUser: null
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = (action.payload || []).filter(c => c !== null); // ✅ remove nulls
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload); // add new User to list
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                state.users = state.users.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },

})

export const { setCurrentUser, clearError } = UserSlice.actions;
export default UserSlice.reducer;