import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveNews } from "../../api/newsApi";

// Async actions
export const fetchActiveNews = createAsyncThunk("news/fetchActive", getActiveNews);

// Slice
const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchActiveNews.fulfilled, (state, action) => {
      state.news = action.payload;
    });
  },
});

export default newsSlice.reducer;
