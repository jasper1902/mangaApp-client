import { useCallback, useEffect } from "react";
import {
  UserType,
  getUser,
  logoutUser,
  updateUser,
  userSelector,
} from "../store/slice/userSlice";
import { useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import { usePostRequest } from "../hook/usePostRequest";
import { updateSearch } from "../store/slice/searchSlice";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import Theme from "./Theme";
import LoginForm, { InitialIdentifierType } from "./LoginForm";
import { toast } from "react-toastify";
import { toastOptions } from "../services/option";

const Nav = () => {
  const dispatch = useAppDispatch();
  const userReducer = useSelector(userSelector);

  const [postData, { data: loginData, errorMessage, hasError }] =
    usePostRequest<UserType>(`${import.meta.env.VITE_API_URL}/api/login`);

  useEffect(() => {
    if (hasError) {
      toast.error(errorMessage, toastOptions);
    }
  }, [errorMessage, hasError]);

  useEffect(() => {
    if (loginData) {
      dispatch(updateUser(loginData));
    }
  }, [loginData, dispatch]);

  const onChangeSearchState = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearch({ title: e.target.value }));
  };

  const onClickLogout = () => {
    dispatch(logoutUser());
  };

  const onSubmitLogin = async (values: InitialIdentifierType) => {
    postData({ user: values });
  };

  const getUserDispatch = useCallback(() => dispatch(getUser()), [dispatch]);

  useEffect(() => {
    getUserDispatch();
  }, [getUserDispatch]);

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
                <UserDropdown
                  userReducer={userReducer}
                  onClickLogout={onClickLogout}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {!userReducer.loggedIn && (
        <LoginForm userReducer={userReducer} onSubmitLogin={onSubmitLogin} />
      )}
    </>
  );
};

export default Nav;
