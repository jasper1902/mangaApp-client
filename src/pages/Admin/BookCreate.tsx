import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { createMangaBook, getMangaById } from "../../services/fetchAPI";
import { userSelector } from "../../store/slice/userSlice";

import { useNavigate, useParams } from "react-router-dom";
import { MangaTypeList } from "../../store/slice/mangaListSlice";
import { toastOptions } from "../../services/option";
import { toast } from "react-toastify";

export interface CreateMangaBookType {
  slug: string;
  image?: File[];
  author: string;
  title: string | null;
  type: "book" | "chapter" | "video";
}

const initialValues: CreateMangaBookType = {
  slug: "",
  image: [],
  title: "",
  author: "",
  type: "book",
};

const BookCreate = () => {
  const userReducer = useSelector(userSelector);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manga, setManga] = useState<MangaTypeList | null>(null);
  const [onProgress, setOnProgress] = useState<number | null>();

  const { mangaId }: { mangaId?: string } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<typeof initialValues>["setFieldValue"]
  ) => {
    const files = e.target.files;
    if (files) {
      setFieldValue("image", files);
    }
  };

  useEffect(() => {
    const fetchManga = async () => {
      if (!mangaId) {
        return;
      }
      const manga = await getMangaById(mangaId, userReducer.user.token);
      setManga(manga.manga);
    };

    fetchManga();
  }, [mangaId, userReducer.user.token]);

  if (!manga) {
    return null;
  }

  return (
    <div className="container mx-auto lg:max-w-screen-xl max-w-screen-sm mt-3">
      <Formik
        key={mangaId}
        initialValues={{
          ...initialValues,
          title: manga.title || "",
        }}
        onSubmit={async (
          values: CreateMangaBookType,
          { resetForm }
        ): Promise<void> => {
          const response = await createMangaBook(
            userReducer.user.token,
            values,
            mangaId as string,
            setOnProgress
          );
          if (response?.status !== 200) {
            toast.error("Failed to create manga book", toastOptions);
            return;
          }
          toast.success(response.data.message, toastOptions);
          resetForm();
          navigate("/dashboard");
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <div>
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}/src/assets${
                        manga.image
                      }`}
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  {onProgress ? (
                    <div className="flex items-center justify-center">
                      <div
                        className="radial-progress bg-primary text-primary-content border-4 border-primary mt-5 h-52 w-52"
                        style={{ "--value": onProgress } as React.CSSProperties}
                      >
                        {onProgress}%
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1>{manga.title}</h1>
                      <label className="label">
                        <span className="label-text">Title</span>
                      </label>

                      <Field
                        type="text"
                        placeholder="Title"
                        className="input input-bordered input-primary w-full"
                        name="title"
                      />

                      <label className="label">
                        <span className="label-text">Type</span>
                      </label>
                      <Field
                        as="select"
                        className="select select-bordered select-primary w-full"
                        name="type"
                      >
                        <option value="book">Book</option>
                        <option value="chapter">Chapter</option>
                        <option value="video">Video</option>
                      </Field>

                      <label className="label">
                        <span className="label-text">Slug</span>
                      </label>
                      <Field
                        type="text"
                        placeholder="Slug"
                        className="input input-bordered input-primary w-full"
                        name="slug"
                      />

                      <div>
                        <label className="label">
                          <span className="label-text">Image</span>
                        </label>
                        <input
                          multiple
                          type="file"
                          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          ref={fileInputRef}
                        />
                      </div>
                      <div>
                        <button className="btn btn-success mt-3" type="submit">
                          Upload
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookCreate;
