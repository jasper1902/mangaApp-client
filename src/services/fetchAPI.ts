import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

export const deleteManga = async (id: string, token: string) => {
  const response = await axios.delete(`${apiBaseUrl}/api/manga/${id}`, {
    headers: { Authorization: `token ${token}` },
  });
  return response;
};

export const deleteMangaBook = async (
  mangaId: string,
  bookId: string,
  token: string
) => {
  const response = await axios.delete(
    `${apiBaseUrl}/api/manga/book/${mangaId}/${bookId}`,
    { headers: { Authorization: `token ${token}` } }
  );
  return response;
};
