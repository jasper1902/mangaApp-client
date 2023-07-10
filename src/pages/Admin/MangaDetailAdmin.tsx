import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { TfiBook } from "react-icons/tfi";
import {
  deleteManga,
  deleteMangaBook,
  updateMangaDetail,
} from "../../services/fetchAPI";
import { MangaTypeList } from "../../types/manga.type";
import { userSelector } from "../../store/slice/userSlice";
import DescriptionAdmin from "../../components/Admin/DescriptionAdmin";

import { FaPlus } from "react-icons/fa";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { toastOptions } from "../../services/option";
import { useFetchData } from "../../hook/useFetchData";

const Manga = () => {
  const { slug } = useParams();
  const [onProgress, setOnProgress] = useState<number | null>(null);
  const navigate = useNavigate();

  const userReducer = useSelector(userSelector);

  const fileInputRef = useRef(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<MangaTypeList>["setFieldValue"]
  ) => {
    const file = e.currentTarget.files?.[0];
    setFieldValue("image", file || null);
  };

  const { data } = useFetchData<MangaTypeList>(
    `${import.meta.env.VITE_API_URL}/api/manga/${slug}`
  );

  const dateString = (date: string): string => {
    const dateObject = new Date(date);
    return dateObject.toLocaleString();
  };

  const onClickDeleteMangaBook = async (bookId: string) => {
    const showConfirmationDialog = async () => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success m-3",
          cancelButton: "btn btn-error m-3",
        },
        buttonsStyling: false,
      });

      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      return result;
    };

    const result = await showConfirmationDialog();
    if (!data) {
      return;
    }

    if (result.isConfirmed) {
      const response = await deleteMangaBook(
        data._id,
        bookId,
        userReducer.user.token
      );

      if (response.status === 200) {
        showSuccessToast(response.data.message);
        navigate("/dashboard");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
    }
  };

  const showSuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const onClickDeleteManga = async () => {
    const showConfirmationDialog = async () => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success m-3",
          cancelButton: "btn btn-error m-3",
        },
        buttonsStyling: false,
      });

      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      return result;
    };

    const result = await showConfirmationDialog();

    if (!data) {
      return;
    }

    if (result.isConfirmed) {
      const response = await deleteManga(data._id, userReducer.user.token);

      if (response.status === 200) {
        showSuccessToast(response.data.message);
        navigate("/dashboard");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
    }
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="container max-w-screen-lg mx-auto">
        <Formik
          initialValues={{
            ...data,
          }}
          onSubmit={async (values: typeof data) => {
            const showConfirmationDialog = async () => {
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success m-3",
                  cancelButton: "btn btn-error m-3",
                },
                buttonsStyling: false,
              });

              const result = await swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
              });

              return result;
            };

            const result = await showConfirmationDialog();

            if (result.isConfirmed) {
              const response = await updateMangaDetail(
                values,
                userReducer.user.token,
                data._id,
                setOnProgress
              );
              if (response?.status !== 200) {
                toast.error("Failed to update manga book", toastOptions);
                return;
              }
              toast.success(response.data.message, toastOptions);
              navigate("/dashboard");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
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
                  {data && <DescriptionAdmin manga={data} values={values} />}
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <div>
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}/src/assets${
                            data.image
                          }`}
                          alt=""
                          draggable={false}
                        />

                        <div>
                          <label className="label">
                            <span className="label-text">Image</span>
                          </label>
                          <input
                            type="file"
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setFieldValue)}
                            ref={fileInputRef}
                          />
                        </div>
                      </div>

                      <div>
                        <p>uploader: {data.uploader}</p>
                        <p>createdAt: {dateString(data.createdAt)}</p>
                        <p>updatedAt: {dateString(data.updatedAt)}</p>
                      </div>

                      <div className="flex items-center justify-around mt-5">
                        <button
                          className="btn btn-error"
                          onClick={onClickDeleteManga}
                          type="button"
                        >
                          Delete
                        </button>

                        <button className="btn btn-success" type="submit">
                          Update
                        </button>
                      </div>
                    </div>

                    <div className="col-span-8">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Description</span>
                        </label>

                        <Field
                          as="textarea"
                          type="text"
                          placeholder="Description"
                          className="textarea textarea-bordered textarea-primary textarea-lg w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 h-80"
                          name="description"
                        />
                      </div>

                      <div>
                        <div className="form-control w-full max-w-xs">
                          <label className="label">
                            <span className="label-text">Slug</span>
                          </label>

                          <Field
                            type="text"
                            placeholder="Slug"
                            className="input input-bordered input-primary w-full"
                            name="slug"
                          />
                        </div>
                      </div>
                      <div className="overflow-x-auto h-96 scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100">
                        <Link to={`/admin/manga/book/${data.slug}`}>
                          <button
                            className="btn btn-success my-3"
                            type="button"
                          >
                            <FaPlus />
                            Add new book
                          </button>
                        </Link>
                        <table className="table table-pin-rows">
                          <thead>
                            <tr>
                              <th>Chapter List</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.chapters?.map((book) => (
                              <tr key={book._id} className="flex items-center ">
                                <td className="hover:bg-accent text-base flex items-center w-full justify-between">
                                  <div className="flex items-center gap-2">
                                    <TfiBook />
                                    <Link
                                      to={`/manga/${data.slug}/${book.type}/${book.slug}`}
                                    >
                                      {book.title}
                                    </Link>
                                  </div>
                                  <div
                                    onClick={() =>
                                      onClickDeleteMangaBook(book._id)
                                    }
                                  >
                                    <AiFillDelete className="cursor-pointer" />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Manga;
