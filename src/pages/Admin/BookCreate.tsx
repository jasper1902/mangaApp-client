import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { userSelector } from "../../store/slice/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { MangaTypeList } from "../../types/manga.type";
import { toastOptions } from "../../services/option";
import { toast } from "react-toastify";
import { useFetchData } from "../../hook/useFetchData";
import { usePostRequest } from "../../hook/usePostRequest";

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

  const { slug } = useParams();
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

  const { data: manga } = useFetchData<MangaTypeList>(
    `${import.meta.env.VITE_API_URL}/api/manga/${slug}`
  );

  const [postData, { progress, status, hasError, errorMessage }] =
    usePostRequest<MangaTypeList>(
      `${import.meta.env.VITE_API_URL}/api/manga/create/book`,
      userReducer.user.token
    );

  useEffect(() => {
    if (status === 200) {
      toast.success("Create manga book successfully", toastOptions);
      navigate("/dashboard");
    }

    if (hasError) {
      toast.error(errorMessage, toastOptions);
      navigate(`/dashboard`);
    }
    
  }, [status, navigate, hasError, errorMessage, slug]);

  if (!manga) {
    return null;
  }

  return (
    <div className="container mx-auto lg:max-w-screen-xl max-w-screen-sm mt-3">
      <Formik
        key={slug}
        initialValues={{
          ...initialValues,
          title: manga.title || "",
          slug: manga.slug || "",
        }}
        onSubmit={async (values: CreateMangaBookType): Promise<void> => {
          const formData = new FormData();
          formData.append("type", String(values.type));
          formData.append("slug", values.slug);
          formData.append("mangaSlug", manga.slug);
          formData.append("title", values.title as string);
          if (values.image) {
            for (let i = 0; i < values.image.length; i++) {
              formData.append("image", values.image[i]);
            }
          }
          postData(formData);
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="flex flex-col">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <div>
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}${
                        manga.image
                      }`}
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  {progress ? (
                    <div className="flex items-center justify-center">
                      <div
                        className="radial-progress bg-primary text-primary-content border-4 border-primary mt-5 h-52 w-52"
                        style={{ "--value": progress } as React.CSSProperties}
                      >
                        {progress}%
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
