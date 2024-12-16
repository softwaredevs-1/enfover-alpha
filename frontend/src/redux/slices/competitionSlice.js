import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getActiveCompetitions, submitCompetition } from "../../api/competitionApi";

// Async actions
export const fetchActiveCompetitions = createAsyncThunk("competitions/fetchActive", getActiveCompetitions);
export const submitCompetitionAnswers = createAsyncThunk("competitions/submit", submitCompetition);

// Slice
const competitionSlice = createSlice({
  name: "competitions",
  initialState: {
    competitions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCompetitions.fulfilled, (state, action) => {
        state.competitions = action.payload;
      });
  },
});

export default competitionSlice.reducer;
