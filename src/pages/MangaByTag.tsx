import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import Mangas from "./Mangas";
import { MangaTypeList } from "../types/manga.type";
import { useAppDispatch } from "../store/store";

import { useFetchData } from "../hook/useFetchData";
import { useSelector } from "react-redux";
import { searchSelector } from "../store/slice/searchSlice";
import { useFilteredMangaList } from "../hook/useFilteredMangaList";

const MangaByTag = () => {
  const dispatch = useAppDispatch();
  const [mangaCategory, setMangaCategory] = useState<boolean>();
  const { category } = useParams();

  const searchReducer = useSelector(searchSelector);
  const { data } = useFetchData<MangaTypeList[]>(
    `${import.meta.env.VITE_API_URL}/api/manga/tags/${category}`
  );
  useEffect(() => {
    category === "manga" ? setMangaCategory(true) : setMangaCategory(false);
  }, [category, dispatch]);

  const filteredMangaList = useFilteredMangaList(data || [], searchReducer);

  return (
    <>
      {!mangaCategory ? (
        <div className="container mx-auto max-w-screen-xl mt-3">
          <Breadcrumb />
          <div className="grid grid-cols-4 gap-4 mt-5">
            {filteredMangaList?.map((manga, index) => (
              <div
                className="card bg-base-100 shadow-xl hover:scale-105 hover:transition-all duration-500"
                key={index}
              >
                <Link to={`/manga/${manga.slug}`}>
                  <figure>
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}/src/assets${
                        manga.image
                      }`}
                      alt=""
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{manga.title}</h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Mangas />
      )}
    </>
  );
};

export default MangaByTag;
