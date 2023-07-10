import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useFetchData } from "../hook/useFetchData";
import { BookType } from "../types/manga.type";

const MangaBookDetail = () => {
  const { bookSlug } = useParams();

  const { data } = useFetchData<BookType>(
    `${import.meta.env.VITE_API_URL}/api/manga/book-slug/${bookSlug}`
  );

  return (
    <div className="container max-w-screen-lg mx-auto">
      <Breadcrumb title={data?.title} />
      {data?.images.map((image, index) => (
        <div
          key={index}
          className="flex"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <img
            decoding="async"
            src={`${import.meta.env.VITE_IMG_URL}/src/assets${image}`}
            alt=""
            loading="lazy"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ))}
    </div>
  );
};

export default MangaBookDetail;
