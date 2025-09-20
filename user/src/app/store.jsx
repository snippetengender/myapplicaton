import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "../features/networkCreate/networkSlice";
import userReducer from "../features/userSlice/userSlice";
import mixReducer from "../features/mixes/mixSlice";
import commentsReducer from "../features/mixes/commentSlice";

export const store = configureStore({
  reducer: {
    network: networkReducer,
    user: userReducer,
    mixes: mixReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
