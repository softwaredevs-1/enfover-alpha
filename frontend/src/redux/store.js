import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import adsReducer from "./slices/adsSlice";
import competitionReducer from "./slices/competitionSlice";
import newsReducer from "./slices/newsSlice";
import analyticsReducer from "./slices/analyticsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    ads: adsReducer,
    competitions: competitionReducer,
    news: newsReducer,
    analytics: analyticsReducer,
  },
});

export default store;
