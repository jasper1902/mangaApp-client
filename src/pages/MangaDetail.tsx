import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchManga } from "../services/fetchAPI";
import Description from "../components/Description";

import { TfiBook } from "react-icons/tfi";
import { MangaTypeList } from "../store/slice/mangaListSlice";

const initialMangaState: MangaTypeList = {
  _id: "",
  description: "",
  title: "",
  chapters: [],
  tagList: [],
  image: "",
  slug: "",
  books: [],
  createdAt: "",
  updatedAt: "",
  uploader: "",
};

interface BookType {
  _id: string;
  book: number;
  slug: string;
  images: string[];
}

const Manga = () => {
  const { slug } = useParams();
  const [manga, setManga] = useState<MangaTypeList>(initialMangaState);
  const [books, setBooks] = useState<BookType[]>();

  const fetchData = async () => {
    if (slug) {
      const data = await fetchManga(slug);
      setManga(data.manga);
      const bookData = await loadBok(data.manga.books);
      setBooks(bookData);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBok = async (data: string[]) => {
    const book = await Promise.all(
      data.map(async (item) => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/manga/book/${item}`
        );
        const data = await res.json();
        return data;
      })
    );
    return book;
  };
  return (
    <>
      <div className="containe max-w-screen-lg mx-auto">
        {manga && (
          <Description
            title={manga.title}
            tagList={manga.tagList}
            slug={manga.slug}
          />
        )}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <img
              src={`${import.meta.env.VITE_IMG_URL}/src/assets${manga.image}`}
              alt=""
            />
          </div>

          <div className="col-span-8">
            {manga.description}
            <div className="overflow-x-auto h-96 scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
              <table className="table table-pin-rows">
                <thead>
                  <tr>
                    <th>Chapter List</th>
                  </tr>
                </thead>
                <tbody>
                  {books?.map((book, index) => (
                    <tr key={index}>
                      <td className="p-0 m-0">
                        <Link
                          to={`/manga/${manga.slug}/${book.book}/${book._id}`}
                        >
                          <div className="hover:bg-accent text-base flex items-center gap-2 cursor-pointer p-4">
                            <TfiBook />
                            {manga.title} เล่มที่ {book.book}
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
      </div>
    </>
  );
};

export default Manga;
