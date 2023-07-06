import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

import { updateSearch } from "../store/slice/searchSlice";
import { useAppDispatch } from "../store/store";
import Theme from "./Theme";
import {
  getUser,
  logoutUser,
  userLogin,
  userSelector,
} from "../store/slice/userSlice";

interface InitialIdentifierType {
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

const Nav = () => {
  const dispatch = useAppDispatch();
  const userReducer = useSelector(userSelector);

  const onChangeSearchState = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearch({ title: e.target.value }));
  };

  const onClickLogout = () => {
    dispatch(logoutUser());
  };

  const onSubmitLogin = async (values: InitialIdentifierType) => {
    dispatch(userLogin(values));
  };

  const getUserDispatch = useCallback(() => dispatch(getUser()), [dispatch]);

  useEffect(() => {
    getUserDispatch();
  }, [getUserDispatch]);

  // useEffect(() => {
  //   dispatch(getUser());
  // }, [dispatch]);


  const renderLoggedInNav = () => (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src={userReducer.user.image} alt="User Avatar" />
        </div>
      </label>
      <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        {userReducer.user.role === "admin" && (
          <li key="admin-page">
            <Link to="/dashboard">
              <p>Admin Page</p>
            </Link>
          </li>
        )}
        <li>
          <button onClick={onClickLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );

  const renderLoginForm = () => (
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

  return (
    <>
      <div className="bg-accent">
        <div className="container mx-auto">
          <div className="navbar bg-accent flex justify-between">
            <div className="">
              <Link to="/">
                <div className="btn btn-ghost normal-case text-xl">
                  Manga App
                </div>
              </Link>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered input-primary w-48 md:w-64"
                onChange={onChangeSearchState}
              />
            </div>

            <div className="flex-none gap-2">
              <Theme />
              {!userReducer.loggedIn ? (
                <label
                  htmlFor="my_modal_7"
                  className="btn btn-ghost border-gray-200 p-3 m-1"
                >
                  Login
                </label>
              ) : (
                renderLoggedInNav()
              )}
            </div>
          </div>
        </div>
      </div>

      {!userReducer.loggedIn && renderLoginForm()}
    </>
  );
};

export default Nav;
