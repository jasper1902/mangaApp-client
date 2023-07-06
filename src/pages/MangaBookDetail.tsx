import { useEffect } from "react";
import { fetchMangaBook, mangaSelector } from "../store/slice/mangaSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import Breadcrumb from "../components/Breadcrumb";

const MangaBookDetail = () => {
  const { bookId } = useParams();
  const mangaReducer = useSelector(mangaSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchMangaBook(bookId as string));
      } catch (error) {
        console.error("Failed to fetch manga book:", error);
      }
    };
    fetchData();
  }, [bookId, dispatch]);

  return (
    <div className="container max-w-screen-lg mx-auto">
      <Breadcrumb title={mangaReducer.title} book={mangaReducer.book} />
      {mangaReducer.images.map((image, index) => (
        <div key={index}>
          <p></p>

          <img src={`${import.meta.env.VITE_IMG_URL}/src/assets${image}`} alt="" loading="lazy"/>
        </div>
      ))}
    </div>
  );
};

export default MangaBookDetail;
