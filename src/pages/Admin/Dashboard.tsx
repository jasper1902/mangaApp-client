import { MangaTypeList } from "../../types/manga.type";
import { useSelector } from "react-redux";
import { searchSelector } from "../../store/slice/searchSlice";
import { Link } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { useFetchData } from "../../hook/useFetchData";
import { useFilteredMangaList } from "../../hook/useFilteredMangaList";

const Dashboard = () => {
  const searchReducer = useSelector(searchSelector);

  const { data } = useFetchData<MangaTypeList[]>(
    `${import.meta.env.VITE_API_URL}/api/manga`
  );

  const filteredMangaList = useFilteredMangaList(data || [], searchReducer);
  return (
    <div className="container mx-auto lg:max-w-screen-xl max-w-screen-sm mt-3">
      <Link to="/admin/manga/create" className="btn btn-success">
        <FaPlus />
        Add new manga
      </Link>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4 mt-5">
        {filteredMangaList?.map((manga) => (
          <div className="card bg-base-100 shadow-xl " key={manga.slug}>
            <Link to={`/admin/manga/${manga.slug}`}>
              {" "}
              <figure>
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${
                    manga.image
                  }`}
                  alt=""
                  className=""
                />
              </figure>
            </Link>

            <div className="card-body">
              <Link to={`/manga/${manga.slug}`}>
                <h2 className="card-title lg:text-xl md:text-lg sm:text-base text-sm">
                  {manga.title}
                </h2>
              </Link>

              <div>
                {manga.tagList?.map((tag) => (
                  <span className="badge badge-ghost badge-sm m-1" key={tag}>
                    <a href={`/${tag}`}>{tag}</a>
                  </span>
                ))}

                <p>{manga.chapters?.length} ตอน</p>

                <button className="btn btn-error hover:btn-secondary">
                  <Link to={`/admin/manga/${manga.slug}`}>Edit</Link>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
