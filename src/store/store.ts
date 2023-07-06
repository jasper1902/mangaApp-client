import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import mangaListReducer from "./slice/mangaListSlice";
import mangaReducer from "./slice/mangaSlice";
import searchReducer from "./slice/searchSlice";
import userReducer from "./slice/userSlice";

const reducer = {
  mangaListReducer,
  mangaReducer,
  searchReducer,
  userReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
