// paymentHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import InvoiceService from '../../services/invoiceService';

export const fetchPaymentHistory = createAsyncThunk(
  'paymentHistory/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.getPaymentHistory();
      return response.data.data.payment_history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const paymentHistorySlice = createSlice({
  name: 'paymentHistory',
  initialState: {
    paymentHistory: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default paymentHistorySlice.reducer;