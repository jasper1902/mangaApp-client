import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

export interface UserType {
  user: {
    username: string;
    email: string;
    role: "admin" | "user" | null;
    token: string;
    image: string;
  };
}

export interface UserInitialStateType extends UserType {
  loading: boolean;
  error: string | null;
  loggedIn: boolean;
}

const initialState: UserInitialStateType = {
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
        `${import.meta.env.VITE_API_URL}/api/account/getme`,
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
