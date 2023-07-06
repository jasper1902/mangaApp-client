import { Field, Form, Formik, FieldArray, FormikHelpers } from "formik";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/slice/userSlice";
import { useRef } from "react";
import { createManga } from "../../services/fetchAPI";

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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<typeof initialValues>["setFieldValue"]
  ) => {
    const file = e.currentTarget.files?.[0];
    setFieldValue("image", file || null);
  };

  return (
    <div className="container mx-auto lg:max-w-screen-xl max-w-screen-sm mt-3">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: typeof initialValues, { resetForm }) => {
          const data = await createManga(values, userReducer.user.token);
          if (data.manga) {
            resetForm();
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="flex flex-col">
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MangaCreate;
