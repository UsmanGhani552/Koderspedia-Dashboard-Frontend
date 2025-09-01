import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import packagesReducer from './slices/packagesSlice';
import clientReducer from './slices/clientSlice';
import invoiceReducer from './slices/invoiceSlice';
import loginActivityReducer from './slices/loginActivitySlice';
import assignedPackagesReducer from './slices/assignedPackagesSlice';
import paymentHistoryReducer from './slices/paymentHistorySlice';
import brandsReducer from './slices/brandSlice';
import usersReducer from './slices/userSlice';

// ✅ Define once
const appReducer = combineReducers({
  auth: authReducer,
  packages: packagesReducer,
  clients: clientReducer,
  invoices: invoiceReducer,
  loginActivity: loginActivityReducer,
  assignedPackages: assignedPackagesReducer,
  paymentHistory: paymentHistoryReducer,
  brands: brandsReducer,
  users: usersReducer,
});

// ✅ Root reducer with logout handling
const rootReducer = (state, action) => {
  if (action.type === 'auth/logout' || action.type === 'auth/login') {
    state = undefined; // Will reset all state (use with caution)
  }
  return appReducer(state, action);
};

// ✅ Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'packages', 'clients', 'invoices', 'loginActivity', 'assignedPackages', 'paymentHistory', 'brands', 'users'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
