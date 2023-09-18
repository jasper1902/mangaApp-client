/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdReportProblem } from "react-icons/md";
import Swal from "sweetalert2";
import moment from "moment";

import { userSelector } from "../store/slice/userSlice";
import { usePostRequest } from "../hook/usePostRequest";
import { useFetchData } from "../hook/useFetchData";
import { useDeleteRequest } from "../hook/useDeleteRequest";
import { toastOptions } from "../services/option";

interface CommentAuthor {
  username: string;
  image: string;
}

interface CommentType {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

interface CommentResponseType {
  message?: string;
  comments?: CommentType[];
}

const Comments: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const currentTime = useMemo(() => moment(), []);

  const [commentData, setCommentData] = useState<CommentType[]>([]);
  const userReducer = useSelector(userSelector);

  const { data: fetchData } = useFetchData<CommentResponseType>(
    `${import.meta.env.VITE_API_URL}/api/comment/get/${slug}`
  );

  const [deleteData, deleteRequestStatus] = useDeleteRequest<{
    comments: CommentType[];
    message: string;
  }>();

  const [postData, postRequestStatus] = usePostRequest<{
    comments: CommentType;
    message: string;
  }>(
    `${import.meta.env.VITE_API_URL}/api/comment/create/${slug}`,
    userReducer.user.token
  );

  useEffect(() => {
    if (fetchData?.comments) {
      setCommentData(fetchData.comments);
    }
  }, [fetchData]);

  useEffect(() => {
    if (deleteRequestStatus.hasError) {
      toast.error(deleteRequestStatus.errorMessage, toastOptions);
    }

    if (
      deleteRequestStatus.status === 200 &&
      deleteRequestStatus.data?.message
    ) {
      toast.success(deleteRequestStatus.data.message, toastOptions);
      setCommentData(deleteRequestStatus.data.comments);
    }
  }, [
    deleteRequestStatus.hasError,
    deleteRequestStatus.status,
    deleteRequestStatus.data?.message,
    deleteRequestStatus.data?.comments,
  ]);

  useEffect(() => {
    if (
      postRequestStatus.status === 200 &&
      postRequestStatus.data?.message
    ) {
      toast.success(postRequestStatus.data.message, toastOptions);
    }

    if (postRequestStatus.hasError && postRequestStatus.errorMessage) {
      toast.error(postRequestStatus.errorMessage, toastOptions);
    }
  }, [
    postRequestStatus.status,
    postRequestStatus.data?.message,
    postRequestStatus.hasError,
    postRequestStatus.errorMessage,
  ]);

  useEffect(() => {
    if (postRequestStatus.data?.comments) {
      const updatedCommentData = [
        postRequestStatus.data.comments,
        ...commentData,
      ];
      setCommentData(updatedCommentData);
    }
  }, [postRequestStatus.data?.comments]);

  const showConfirmationDialog = async (): Promise<boolean> => {
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

    return result.isConfirmed;
  };

  if (!slug) return null;

  return (
    <>
      <Formik
        initialValues={{ body: "" }}
        onSubmit={(values, { resetForm }) => {
          postData({ comments: values });
          resetForm();
        }}
      >
        <Form className="w-full rounded-lg px-4 pt-2 mx-auto">
          <div className="flex flex-wrap -mx-3 mb-6">
            <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
              Add a new comment
            </h2>
            <div className="w-full md:w-full px-3 mb-2 mt-2">
              <Field
                as="textarea"
                type="text"
                placeholder="Type Your Comment"
                className="textarea textarea-primary leading-normal resize-none w-full h-20 py-2 px-3 font-medium"
                name="body"
              />
            </div>

            <div className="w-full md:w-full flex items-start px-3">
              <div className="mr-1">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={!userReducer.loggedIn}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {commentData.map((comment: CommentType) => (
            <article className="p-2 text-base rounded-lg" key={comment.id}>
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm">
                    <img
                      className="mr-2 w-6 h-6 rounded-full"
                      src={comment.author.image}
                      alt="avatar"
                    />
                    {comment.author.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {moment
                      .duration(currentTime.diff(comment.createdAt))
                      .humanize()}{" "}
                    ago
                  </p>
                </div>
                <div className="dropdown">
                  <label tabIndex={0} className="cursor-pointer">
                    <BsThreeDots />
                  </label>
                  {userReducer.user.username === comment.author.username ? (
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a>
                          edit <CiEdit />
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={async () => {
                            const confirmed = await showConfirmationDialog();
                            if (confirmed) {
                              deleteData(
                                `${
                                  import.meta.env.VITE_API_URL
                                }/api/comment/delete/${slug}/${comment.id}`,
                                userReducer.user.token
                              );
                            }
                          }}
                        >
                          delete <RiDeleteBin6Fill />
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shado  w bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a>
                          report <MdReportProblem />
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </footer>
              <div>
                <p className="break-words whitespace-pre-wrap">
                  {comment.body}{" "}
                </p>
              </div>
              <hr className="h-px my-6 bg-primary border-0" />
            </article>
          ))}
        </Form>
      </Formik>
    </>
  );
};

export default Comments;
