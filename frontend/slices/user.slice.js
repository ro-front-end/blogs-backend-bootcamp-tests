import { getUserById } from "@/services/userServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const userByIdThunk = createAsyncThunk(
  "user/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const user = await getUserById(id);
      return user;
    } catch (error) {
      return rejectWithValue(error || "Failed to fetch user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
