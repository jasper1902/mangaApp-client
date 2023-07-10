import { useMemo } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { MangaTypeList } from "../types/manga.type";
import { useSelector } from "react-redux";

import { searchSelector } from "../store/slice/searchSlice";
import { useFetchData } from "../hook/useFetchData";

const Mangas = () => {
  const searchReducer = useSelector(searchSelector);

  const { data } = useFetchData<MangaTypeList[]>(
    `${import.meta.env.VITE_API_URL}/api/manga`
  );

  const filteredMangaList = useMemo(() => {
    return data?.filter((manga) =>
      manga.title.toLowerCase().includes(searchReducer.title.toLowerCase())
    );
  }, [data, searchReducer]);

  return (
    <div className="container mx-auto lg:max-w-screen-xl max-w-screen-sm mt-3">
      <Breadcrumb />
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 mt-5">
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
                  className=""
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title lg:text-xl md:text-lg sm:text-base text-sm">
                  {manga.title}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mangas;
