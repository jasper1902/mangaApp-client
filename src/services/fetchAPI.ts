import axios, { AxiosProgressEvent } from "axios";
import { CreateMangaType } from "../pages/Admin/MangaCreate";
import { CreateMangaBookType } from "../pages/Admin/BookCreate";
import { MangaTypeList } from "../store/slice/mangaListSlice";
const apiBaseUrl = import.meta.env.VITE_API_URL;

export const fetchManga = async (slug: string) => {
  const response = await axios.get(`${apiBaseUrl}/api/manga/${slug}`);
  return response.data;
};

export const fetchUsername = async (userId: string) => {
  const response = await axios.post(`${apiBaseUrl}/api/getusername`, {
    user: { userId: userId },
  });
  return response.data;
};

export const createManga = async (
  values: CreateMangaType,
  token: string,
  setProgress: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("slug", values.slug);
  if (values.image) {
    formData.append("image", values.image);
  }

  values.tagList.forEach((tag, index) => {
    formData.append(`tagList[${index}]`, tag);
  });
  const response = await axios.post(
    `${apiBaseUrl}/api/manga/create`,
    formData,
    {
      headers: { Authorization: `token ${token}` },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total !== undefined) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(progress);
        }
      },
    }
  );
  return response;
};

export const deleteManga = async (id: string, token: string) => {
  const response = await axios.delete(`${apiBaseUrl}/api/manga/${id}`, {
    headers: { Authorization: `token ${token}` },
  });
  return response;
};

export const createMangaBook = async (
  token: string,
  values: CreateMangaBookType,
  mangaId: string,
  setProgress: (progress: number) => void
) => {
  if (!values.title) {
    return;
  }
  const formData = new FormData();
  formData.append("book", String(values.book));
  formData.append("slug", values.slug);
  formData.append("mangaID", mangaId);
  formData.append("title", values.title);
  if (values.image) {
    for (let i = 0; i < values.image.length; i++) {
      formData.append("image", values.image[i]);
    }
  }
  const response = await axios.post(
    `${apiBaseUrl}/api/manga/create/book`,
    formData,
    {
      headers: { Authorization: `token ${token}` },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total !== undefined) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(progress);
        }
      },
    }
  );
  return response;
};

export const getMangaById = async (mangaId: string, token: string) => {
  const response = await axios.get(`${apiBaseUrl}/api/manga/id/${mangaId}`, {
    headers: { Authorization: `token ${token}` },
  });
  return response.data;
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
export const updateMangaDetail = async (
  values: MangaTypeList,
  token: string,
  mangaId: string,
  setProgress: (progress: number) => void
) => {
  const formData = new FormData();

  const { title, description, slug, image, tagList } = values;

  formData.append("title", title);
  formData.append("description", description || "");
  formData.append("slug", slug);

  if (image) {
    formData.append("image", image);
  }

  if (tagList?.length) {
    tagList.forEach((tag, index) => {
      formData.append(`tagList[${index}]`, tag);
    });
  }

  const url = `${import.meta.env.VITE_API_URL}/api/manga/update/${mangaId}`;

  const response = await axios.put(url, formData, {
    headers: { Authorization: `token ${token}` },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total !== undefined) {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setProgress(progress);
      }
    },
  });

  return response;
};
