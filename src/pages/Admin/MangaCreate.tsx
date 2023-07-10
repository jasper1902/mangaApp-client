import { Field, Form, Formik, FieldArray, FormikHelpers } from "formik";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/slice/userSlice";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePostRequest } from "../../hook/usePostRequest";
import { MangaTypeList } from "../../types/manga.type";
import { toastOptions } from "../../services/option";
import { toast } from "react-toastify";

export interface CreateMangaType {
  title: string;
  description: string;
  slug: string;
  tagList: string[];
  image?: null | string;
}

const initialValues: CreateMangaType = {
  title: "",
  description: "",
  slug: "",
  tagList: [],
  image: null,
};

const MangaCreate = () => {
  const userReducer = useSelector(userSelector);
  const fileInputRef = useRef(null);

  const [postData, { progress, statusText }] = usePostRequest<MangaTypeList>(
    `${import.meta.env.VITE_API_URL}/api/manga/create`,
    userReducer.user.token
  );

  const navigate = useNavigate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<typeof initialValues>["setFieldValue"]
  ) => {
    const file = e.currentTarget.files?.[0];
    setFieldValue("image", file || null);
  };

  useEffect(() => {
    if (statusText === "OK") {
      toast.success("Create manga book successfully", toastOptions);
      navigate("/dashboard");
    }
  }, [statusText, navigate]);

  return (
    <div className="container mx-auto lg:max-w-screen-xl max-w-screen-sm mt-3">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: typeof initialValues) => {
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
          postData(formData);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="flex flex-col">
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
                  {" "}
                  <label className="label">
                    <span className="label-text">title</span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Title"
                    className="input input-bordered input-primary w-full"
                    name="title"
                  />
                  <label className="label">
                    <span className="label-text">description</span>
                  </label>
                  <Field
                    type="text"
                    placeholder="description"
                    className="input input-bordered input-primary w-full"
                    name="description"
                  />
                  <label className="label">
                    <span className="label-text">slug</span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Slug"
                    className="input input-bordered input-primary w-full"
                    name="slug"
                  />
                  <label className="label">
                    <span className="label-text">tag list</span>
                  </label>
                  <FieldArray name="tagList">
                    {({ push, remove }) => (
                      <div className="flex flex-wrap gap-4 lg:max-w-screen-xl max-w-screen-sm items-center">
                        {values.tagList.map((_tag, index) => (
                          <div key={index}>
                            <Field
                              type="text"
                              placeholder="Tag"
                              className="input input-bordered input-primary w-72 mr-3"
                              name={`tagList[${index}]`}
                            />
                            <button
                              type="button"
                              className="btn btn-error"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={() => push("")}
                        >
                          Add Tag
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <div>
                    <label className="label">
                      <span className="label-text">image</span>
                    </label>
                    <input
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MangaCreate;
