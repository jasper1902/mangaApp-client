import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SearchType {
  title: string;
}

const initialState: SearchType = {
  title: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState: initialState,
  reducers: {
    updateSearch: (_state, action: PayloadAction<SearchType>) => {
      action.payload;
      return action.payload;
    },
  },
});

export const { updateSearch } = searchSlice.actions;
export const searchSelector = (store: RootState) => store.searchReducer;
export default searchSlice.reducer;
