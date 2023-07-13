import { Link, useParams } from "react-router-dom";
import { TfiBook } from "react-icons/tfi";
import Description from "../components/Description";
import { useFetchData } from "../hook/useFetchData";
import Loading from "../components/Loading";
import { MangaTypeList } from "../types/manga.type";
import Comments from "../components/Comments";

const Manga = () => {
  const { slug } = useParams();

  const { data, isLoading } = useFetchData<MangaTypeList>(
    `${import.meta.env.VITE_API_URL}/api/manga/${slug}`
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="containe max-w-screen-lg mx-auto">
          {data && (
            <Description
              title={data.title}
              tagList={data.tagList}
              slug={data.slug}
            />
          )}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <img
                src={`${import.meta.env.VITE_IMG_URL}/src/assets${data?.image}`}
                alt=""
              />
            </div>

            <div className="col-span-8">
              {data?.description}
              <div className="overflow-x-auto h-96 scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                <table className="table table-pin-rows">
                  <thead>
                    <tr>
                      <th>Chapter List</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.chapters?.map((book, index) => (
                      <tr key={index}>
                        <td className="p-0 m-0">
                          <Link
                            to={`/manga/${data.slug}/${book.type}/${book.slug}`}
                          >
                            <div className="hover:bg-accent text-base flex items-center gap-2 cursor-pointer p-4">
                              <TfiBook />
                              {book.title}
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Comments />
        </div>
      )}
    </>
  );
};

export default Manga;
