import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { toastOptions } from "../../services/option";

interface UserType {
  user: {
    username: string;
    email: string;
    role: "admin" | "user" | null;
    token: string;
    image: string;
  };
}

interface InitialStateType extends UserType {
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
}

const initialState: InitialStateType = {
  user: {
    username: "",
    email: "",
    role: null,
    token: "",
    image: "",
  },
  loading: false,
  error: null,
  loggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<UserType>) => {
      const { token } = action.payload.user;
      localStorage.setItem("token", token);
      state.user = action.payload.user;
      state.loggedIn = true;
    },
    setError: (state, action: PayloadAction<{ error: string }>) => {
      const { error } = action.payload;
      if (error) {
        state.error = error;
      }
    },

    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      const { loading } = action.payload;
      if (loading !== undefined) {
        state.loading = loading;
      }
    },

    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.user = initialState.user;
      state.loggedIn = false;
    },
  },
});

interface UserObjType {
  identifier: string;
  password: string;
}

export const userLogin = createAsyncThunk(
  "user/login",
  async (userObj: UserObjType, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ loading: true }));
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          user: userObj,
        }
      );
      dispatch(updateUser(response.data));
    } catch (error) {
      console.log("Error fetching user:", error);
      const axiosError = error as AxiosError<{ error: string }>;
      const { response } = axiosError;
      if (response && response.data) {
        dispatch(setError({ error: response.data.error }));
        toast.error(response.data.error, toastOptions);
      }
      return rejectWithValue("Failed to login");
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }
);

export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logoutUser());
        return rejectWithValue("No token available");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getme`,
        { headers: { Authorization: `token ${token}` } }
      );
      dispatch(updateUser(response.data));
    } catch (error) {
      console.log("Error fetching user:", error);
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const { updateUser, logoutUser, setError, setLoading } =
  userSlice.actions;
export const userSelector = (store: RootState) => store.userReducer;
export default userSlice.reducer;
