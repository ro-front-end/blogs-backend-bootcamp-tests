import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../slices/blogSlice";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/user.slice";

const reduxStore = configureStore({
  reducer: {
    blogs: blogReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      blogs: blogReducer,
      auth: authReducer,
      user: userReducer,
    },
    preloadedState,
  });
}

export default reduxStore;
