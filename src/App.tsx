import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./components/Nav";
import Loading from "./components/Loading";
import PrivateRoute from "./components/Admin/PrivateRoute";
import Mangas from "./pages/Mangas";
import MangaByTag from "./pages/MangaByTag";
import Dashboard from "./pages/Admin/Dashboard";
import MangaDetailAdmin from "./pages/Admin/MangaDetailAdmin";
import { userSelector } from "./store/slice/userSlice";
import MangaCreate from "./pages/Admin/MangaCreate";
import BookCreate from "./pages/Admin/BookCreate";
import Login from "./pages/account/login";

const MangaDetail = lazy(() => import("./pages/MangaDetail"));
const MangaBookDetail = lazy(() => import("./pages/MangaBookDetail"));

const App = () => {
  const userReducer = useSelector(userSelector);
  const fallbackLoader = <Loading />;

  return (
    <Router>
      <Nav />
      <Suspense fallback={fallbackLoader}>
        <Routes>
          <Route path="/" element={<Mangas />} />
          <Route path="/:category" element={<MangaByTag />} />
          <Route
            path="/manga/:slug"
            element={
              <Suspense fallback={fallbackLoader}>
                <MangaDetail />
              </Suspense>
            }
          />
          <Route
            path="/manga/:name/:book/:bookSlug"
            element={
              <Suspense fallback={fallbackLoader}>
                <MangaBookDetail />
              </Suspense>
            }
          />
          <Route path="/account/login" element={<Login />} />

          {userReducer.user.role && (
            <Route
              path="/dashboard"
              element={
                <PrivateRoute
                  element={<Dashboard />}
                  role={userReducer.user.role}
                />
              }
            />
          )}

          {userReducer.user.role && (
            <Route
              path="/admin/manga/:slug"
              element={
                <PrivateRoute
                  element={<MangaDetailAdmin />}
                  role={userReducer.user.role}
                />
              }
            />
          )}

          {userReducer.user.role && (
            <Route
              path="/admin/manga/create"
              element={
                <PrivateRoute
                  element={<MangaCreate />}
                  role={userReducer.user.role}
                />
              }
            />
          )}

          {userReducer.user.role && (
            <Route
              path="/admin/manga/book/:slug"
              element={
                <PrivateRoute
                  element={<BookCreate />}
                  role={userReducer.user.role}
                />
              }
            />
          )}
        </Routes>
      </Suspense>
      <ToastContainer />
    </Router>
  );
};

export default App;
