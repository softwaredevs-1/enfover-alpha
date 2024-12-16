import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCourses, getActiveCourses, getCoursesByGrade } from "../../api/courseApi";

// Async actions
export const fetchAllCourses = createAsyncThunk("courses/fetchAll", getAllCourses);
export const fetchActiveCourses = createAsyncThunk("courses/fetchActive", getActiveCourses);
export const fetchCoursesByGrade = createAsyncThunk("courses/fetchByGrade", getCoursesByGrade);

// Slice
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    allCourses: [],
    activeCourses: [],
    gradeCourses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.allCourses = action.payload;
      })
      .addCase(fetchActiveCourses.fulfilled, (state, action) => {
        state.activeCourses = action.payload;
      })
      .addCase(fetchCoursesByGrade.fulfilled, (state, action) => {
        state.gradeCourses = action.payload;
      });
  },
});

export default courseSlice.reducer;
