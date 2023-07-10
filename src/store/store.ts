import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import searchReducer from "./slice/searchSlice";
import userReducer from "./slice/userSlice";

const reducer = {
  searchReducer,
  userReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
