import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdReportProblem } from "react-icons/md";
import { userSelector } from "../store/slice/userSlice";
import { usePostRequest } from "../hook/usePostRequest";
import { useFetchData } from "../hook/useFetchData";
import { toastOptions } from "../services/option";

interface CommentType {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    username: string;
    image: string;
  };
}

const Comments: React.FC = () => {
  const { slug } = useParams();
  const userReducer = useSelector(userSelector);

  const [postData, { statusText, hasError, errorMessage }] = usePostRequest<{
    body: string;
  }>(
    `${import.meta.env.VITE_API_URL}/api/comment/create/${slug}`,
    userReducer.user.token
  );

  useEffect(() => {
    if (statusText === "OK") {
      toast.success(`Comment created successfully`, toastOptions);
    }

    if (hasError) {
      toast.success(errorMessage, toastOptions);
    }
  }, [errorMessage, hasError, statusText]);

  const { data } = useFetchData<{ comments: CommentType[] }>(
    `${import.meta.env.VITE_API_URL}/api/comment/get/${slug}`
  );

  return (
    <>
      <Formik
        initialValues={{ body: "" }}
        onSubmit={(values, { resetForm }) => {
          postData(values);
          resetForm();
        }}
      >
        <Form className="w-full max-w-xl rounded-lg px-4 pt-2 mx-auto">
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

          {data?.comments.map((comment: CommentType) => (
            <article className="p-2 text-base rounded-lg " key={comment.id}>
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
                        <a>
                          delete <RiDeleteBin6Fill />
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
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
              <p>{comment.body}</p>
              <hr className="h-px my-6 bg-primary border-0 "></hr>
            </article>
          ))}
        </Form>
      </Formik>
    </>
  );
};

export default Comments;
