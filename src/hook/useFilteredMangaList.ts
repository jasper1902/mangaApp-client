import { useMemo } from "react";
import { MangaTypeList } from "../types/manga.type";
import { SearchType } from "../store/slice/searchSlice";

export const useFilteredMangaList = (
  data: MangaTypeList[],
  searchReducer: SearchType
): MangaTypeList[] => {
  const filteredMangaList = useMemo(() => {
    return data?.filter((manga) =>
      manga.title.toLowerCase().includes(searchReducer.title.toLowerCase())
    );
  }, [data, searchReducer]);

  return filteredMangaList;
};
