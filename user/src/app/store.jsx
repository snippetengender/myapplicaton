import { configureStore } from "@reduxjs/toolkit";
import networkReducer from "../features/networkCreate/networkSlice";
import userReducer from "../features/userSlice/userSlice";
import mixReducer from "../features/mixes/mixSlice";
import commentsReducer from "../features/mixes/commentSlice";
import lowkeyProfileReducer from "../features/userSlice/lowkeySlice";
import authReducer from "../features/userSlice/authSlice";
import onboardingReducer from "../features/userSlice/onboardingSlice";

export const store = configureStore({
  reducer: {
    network: networkReducer,
    user: userReducer,
    mixes: mixReducer,
    comments: commentsReducer,
    lowkeyProfile: lowkeyProfileReducer,
    auth: authReducer,
    onboarding: onboardingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
