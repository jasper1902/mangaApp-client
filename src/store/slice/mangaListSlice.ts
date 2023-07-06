import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface MangaTypeList {
  description?: string;
  _id: string;
  title: string;
  chapters?: string[];
  tagList?: string[];
  image: string;
  slug: string;
  books?: string[];
  createdAt: string;
  updatedAt: string;
  uploader: string;
}

const initialState: MangaTypeList[] = [];
const mangaListSlice = createSlice({
  name: "MangaList",
  initialState,
  reducers: {
    updateMangaList: (_state, action: PayloadAction<MangaTypeList[]>) => {
      action.payload;
      return action.payload;
    },
  },
});

export const fetchMangaList = createAsyncThunk(
  "mangaList",
  async (_, { dispatch }) => {
    try {
      const mangaList = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/manga`
      );

      dispatch(updateMangaList(mangaList.data));
    } catch (error: unknown) {
      console.log("Error fetching manga list:", error);
    }
  }
);

export const { updateMangaList } = mangaListSlice.actions;
export const mangaListSelector = (store: RootState) => store.mangaListReducer;
export default mangaListSlice.reducer;
