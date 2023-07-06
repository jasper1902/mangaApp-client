import React from "react";
import Breadcrumb from "../Breadcrumb";
import { TbFileDescription } from "react-icons/tb";
import { MangaTypeList } from "../../store/slice/mangaListSlice";
import { RxCross2 } from "react-icons/rx";
import { Field, FieldArray } from "formik";

type Props = {
  manga: MangaTypeList;
  values: MangaTypeList;
};

const DescriptionAdmin: React.FC<Props> = ({ manga, values }) => {
  return (
    <div className="my-1 mx-auto gap-4 bg-accent rounded-t-md">
      {manga.title && <Breadcrumb title={manga.title} slug={manga.slug} />}
      <div className="flex items-start rounded-b-md p-4 shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border">
          <TbFileDescription />
        </div>

        <div className="ml-4 w-full">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Title</span>
            </label>

            <Field
              type="text"
              placeholder="Title"
              className="input input-bordered input-primary w-full"
              name="title"
            />
          </div>

          <div className="mt-2 text-sm">
            <p>tags :</p>

            <FieldArray name="tagList">
              {({ push, remove }) => (
                <div className="flex gap-2 flex-wrap">
                  {values?.tagList?.map((_tag, index) => (
                    <div key={index} className="flex items-center">
                      <Field
                        type="text"
                        placeholder="Tag"
                        className="input input-bordered input-primary input-xs max-w-xs"
                        name={`tagList[${index}]`}
                      />

                      <div>
                        <RxCross2
                          className="cursor-pointer"
                          onClick={() => remove(index)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-xs"
                    onClick={() => push("")}
                  >
                    Add Tag
                  </button>
                </div>
              )}
            </FieldArray>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionAdmin;
