import { useEffect } from "react";
import { fetchMangaBook, mangaSelector } from "../store/slice/mangaSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import Breadcrumb from "../components/Breadcrumb";

const MangaBookDetail = () => {
  const { bookSlug } = useParams();
  const mangaReducer = useSelector(mangaSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchMangaBook(bookSlug as string));
      } catch (error) {
        console.error("Failed to fetch manga book:", error);
      }
    };
    fetchData();
  }, [bookSlug, dispatch]);

  return (
    <div className="container max-w-screen-lg mx-auto">
      <Breadcrumb title={mangaReducer.title} />
      {mangaReducer.images.map((image, index) => (
        <div key={index}>
          <p></p>

          <img
            decoding="async"
            src={`${import.meta.env.VITE_IMG_URL}/src/assets${image}`}
            alt=""
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default MangaBookDetail;
