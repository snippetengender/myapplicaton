// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
// Import the reducer from our slice
import networkReducer from "../features/networkCreate/networkSlice";
import userReducer from "../features/userSlice/userSlice";
export const store = configureStore({
  reducer: {
    // Add the reducer to the store
    network: networkReducer,
    user: userReducer,
  },
  // Add middleware to prevent errors with non-serializable File objects
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
