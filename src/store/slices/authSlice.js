import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/authService';


export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.getUser();
      const user = response.data.user;
      
      // Update localStorage to stay consistent
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      
      return user;
    } catch (error) {
      // Clear auth state if 401 Unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
      
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch user data'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      console.log("Login response:", response);
      // Store tokens directly in localStorage
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role); // Store role for later use
      return { token, user, role: user.role }; // ✅ only return required payload
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.data?.error?.[0] ||
        error.message;
      return rejectWithValue(errorMessage);
    }
  }
);
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      console.log("Register response:", response);
      // Store tokens directly in localStorage
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role); // Store role for later use
      return { token, user, role: user.role }; // ✅ only return required payload
    } catch (error) {
      let errorMessage;
      if (error.response?.data?.errors) {
        const [field, messages] = Object.entries(error.response.data.errors)[0];
        errorMessage = `${messages[0]}`; // "username: The username has already been taken."
      } else {
        errorMessage = error.response?.data?.message || error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = () => async (dispatch) => {
  try {
    await AuthService.logout(); // Call your logout API
  } finally {
    dispatch(logout()); // Clear local state regardless of API success
  }
};

export const editProfile = createAsyncThunk(
  'auth/editProfile',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const response = await AuthService.editProfile(formData);

      // Extract the client data from the nested structure
      const clientData = response.data?.data?.client;

      if (!clientData) {
        throw new Error('No client data returned from API');
      }

      // Get current user data to preserve role
      const currentUser = getState().auth.user;

      // Merge updated data with existing role
      const updatedUser = {
        ...clientData,
        role: currentUser?.role // Preserve the existing role
      };

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Profile update failed"
      );
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear all storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('role');

      state.user = null;
      state.token = null;
      state.role = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Optional: Clear auth state if fetch fails
        if (action.payload?.includes('Unauthorized')) {
          state.user = null;
          state.token = null;
          state.role = null;
        }
      });

  }
});

export const { logout,clearErrors } = authSlice.actions;
export default authSlice.reducer;