import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveAds, createAd } from "../../api/adsApi";

// Async actions
export const fetchActiveAds = createAsyncThunk("ads/fetchActive", getActiveAds);
export const addAd = createAsyncThunk("ads/add", createAd);

// Slice
const adsSlice = createSlice({
  name: "ads",
  initialState: {
    activeAds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveAds.fulfilled, (state, action) => {
        state.activeAds = action.payload;
      })
      .addCase(addAd.fulfilled, (state, action) => {
        state.activeAds.push(action.payload);
      });
  },
});

export default adsSlice.reducer;
