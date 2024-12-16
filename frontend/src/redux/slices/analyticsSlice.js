import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnalytics } from "../../api/userApi";

// Async actions
export const fetchAnalytics = createAsyncThunk("analytics/fetch", getAnalytics);

// Slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    analyticsData: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
      state.analyticsData = action.payload;
    });
  },
});

export default analyticsSlice.reducer;
