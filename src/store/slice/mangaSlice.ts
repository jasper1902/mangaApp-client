import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface MangaType {
  title: string;
  chapter?: string;
  book?: string;
  images: string[];
  slug: string;
}

const initialState: MangaType = {
  title: "",
  chapter: "",
  book: "",
  images: [],
  slug: "",
};
const mangaSlice = createSlice({
  name: "Manga",
  initialState,
  reducers: {
    updateManga: (_state, action: PayloadAction<MangaType>) => {
      action.payload;
      return action.payload;
    },
  },
});

export const fetchMangaBook = createAsyncThunk(
  "manga/book",
  async (BookId: string, { dispatch }) => {
    try {
      const manga = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/manga/book/${BookId}`
      );

      dispatch(updateManga(manga.data));
    } catch (error: unknown) {
      console.log("Error fetching manga:", error);
    }
  }
);

export const { updateManga } = mangaSlice.actions;
export const mangaSelector = (store: RootState) => store.mangaReducer;
export default mangaSlice.reducer;
