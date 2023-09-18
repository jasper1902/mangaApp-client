import { Link, useNavigate } from "react-router-dom";

import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { UserInitialStateType } from "../store/slice/userSlice";

import { usePostRequest } from "../hook/usePostRequest";
import { useEffect } from "react";
import { toastOptions } from "../services/option";
import { toast } from "react-toastify";

export interface InitialIdentifierType {
  username: string;
  email: string;
  password: string;
}

const initialIdentifierValue: InitialIdentifierType = {
  username: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string().trim().min(4).max(32).required("Username is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().email().required("Email is required"),
});

const RegisterForm = ({
  userReducer,
}: {
  userReducer: UserInitialStateType;
}) => {
  const navigate = useNavigate();
  const [postData, postRequestStatus] = usePostRequest<{ message: string }>(
    `${import.meta.env.VITE_API_URL}/api/account/register`
  );
  useEffect(() => {
    if (postRequestStatus.hasError) {
      toast.error(postRequestStatus.errorMessage, toastOptions);
    }

    if (
      postRequestStatus.status === 201 &&
      postRequestStatus?.data?.message
    ) {
      const modal = document.getElementById("my_modal_7") as HTMLInputElement;
      if (modal) {
        modal.checked = false;
      }
      toast.success(postRequestStatus.data.message, toastOptions);
      navigate("/account/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    postRequestStatus?.data?.message,
    postRequestStatus.status,
    postRequestStatus.hasError,
    postRequestStatus.errorMessage,
  ]);

  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className={`modal`}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Register!</h3>
          <Formik
            initialValues={initialIdentifierValue}
            onSubmit={async (values: InitialIdentifierType, { resetForm }) => {
              postData({ user: values });
              resetForm();
            }}
            validationSchema={validationSchema}
          >
            {({ errors, touched }) => (
              <Form>
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <Field
                  type="text"
                  placeholder="Username"
                  className="input input-bordered input-primary w-full"
                  id="username"
                  name="username"
                />

                {errors.username && touched.username && (
                  <label className="label">
                    <span className="label-text-alt text-primary text-base">
                      {errors.username}
                    </span>
                  </label>
                )}

                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <Field
                  type="email"
                  placeholder="Email"
                  className="input input-bordered input-primary w-full"
                  id="email"
                  name="email"
                />

                {errors.email && touched.email && (
                  <label className="label">
                    <span className="label-text-alt text-primary text-base">
                      {errors.email}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <Field
                  type="password"
                  placeholder="Password"
                  className="input input-bordered input-primary w-full"
                  name="password"
                  id="password"
                />
                {errors.password && touched.password && (
                  <label className="label">
                    <span className="label-text-alt text-primary text-base">
                      {errors.password}
                    </span>
                  </label>
                )}
                <button
                  className={`btn  ${
                    userReducer.loading ? "btn-disabled" : "btn-success"
                  } mt-3`}
                  type="submit"
                >
                  {userReducer.loading ? "Logging in..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <p>username: admin or admin@admin.com, password: admin1234</p>
          <p>
            Already have an account?{" "}
            <Link to="/account/login" className="font-bold text-secondary">
              Login
            </Link>
          </p>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </>
  );
};
export default RegisterForm;
