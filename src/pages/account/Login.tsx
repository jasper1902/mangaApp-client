import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import {
  UserType,
  updateUser,
  userSelector,
} from "../../store/slice/userSlice";
import { useAppDispatch } from "../../store/store";
import { usePostRequest } from "../../hook/usePostRequest";
import { useEffect } from "react";
import { toastOptions } from "../../services/option";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

export interface InitialIdentifierType {
  identifier: string;
  password: string;
}

const initialIdentifierValue: InitialIdentifierType = {
  identifier: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  identifier: Yup.string().trim().required("Username or Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userReducer = useSelector(userSelector);
  useEffect(() => {
    if (userReducer.loggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReducer.loggedIn]);
  const [postData, { data: loginData, errorMessage, hasError, statusText }] =
    usePostRequest<UserType>(
      `${import.meta.env.VITE_API_URL}/api/account/login`
    );

  useEffect(() => {
    if (hasError) {
      toast.error(errorMessage, toastOptions);
    }

    if (loginData && statusText === "OK") {
      dispatch(updateUser(loginData));
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData, dispatch, statusText, errorMessage, hasError]);

  const onSubmitLogin = async (values: InitialIdentifierType) => {
    postData({ user: values });
  };
  return (
    <div className="container mx-auto lg:max-w-screen-md max-w-screen-sm mt-3">
      {userReducer.loggedIn ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialIdentifierValue}
          onSubmit={onSubmitLogin}
          validationSchema={validationSchema}
        >
          {({ errors, touched }) => (
            <Form>
              <label className="label">
                <span className="label-text">Username or Email</span>
              </label>
              <Field
                type="text"
                placeholder="Username or Email"
                className="input input-bordered input-primary w-full"
                id="identifier"
                name="identifier"
              />

              {errors.identifier && touched.identifier && (
                <label className="label">
                  <span className="label-text-alt text-primary text-base">
                    {errors.identifier}
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
                {userReducer.loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};
export default Login;
