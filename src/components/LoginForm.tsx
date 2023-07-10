import { Link } from "react-router-dom";

import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { UserInitialStateType } from "../store/slice/userSlice";

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

const LoginForm = ({
  userReducer,
  onSubmitLogin,
}: {
  userReducer: UserInitialStateType;
  onSubmitLogin: (values: InitialIdentifierType) => void;
}) => (
  <>
    <input type="checkbox" id="my_modal_7" className="modal-toggle" />
    <div className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Login!</h3>
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

        <p>username: admin or admin@admin.com, password: admin1234</p>
        <p>
          Already have an account?{" "}
          <Link to="/register" className="font-bold text-secondary">
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

export default LoginForm;
