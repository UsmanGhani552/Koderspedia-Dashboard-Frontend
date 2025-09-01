import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ClientService from '../../services/clientService';


export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ClientService.getAll();
            return response.data.data.clients; // Adjusted to match your API response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const createClient = createAsyncThunk(
    'Clients/createClient',
    async (ClientData, { rejectWithValue }) => {
        try {
            console.log("Creating client with data:", ClientData);
            const response = await ClientService.create(ClientData);
            if (response.data?.data?.client) {
                return response.data.data.client;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateClient = createAsyncThunk(
    'Clients/updateClient',
    async ({ id, clientData }, { rejectWithValue }) => {
        try {
            const response = await ClientService.update(id, clientData);
            if (response.data?.data?.client) {
                return response.data.data.client;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await ClientService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const clientSlice = createSlice({
    name: 'clients',
    initialState: {
        clients: [],
        loading: false,
        error: null,
        currentClient: null
    },
    reducers: {
        setCurrentClient: (state, action) => {
            state.currentClient = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = (action.payload || []).filter(c => c !== null); // ✅ remove nulls
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Create Client
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients.push(action.payload); // add new client to list
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Update Client
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                const updatedClient = action.payload;
                state.clients = state.clients.map(client =>
                    client.id === updatedClient.id ? updatedClient : client
                );
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete client
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = state.clients.filter(pkg => pkg.id !== action.payload);
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },

})

export const { setCurrentClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;