import { Link } from "react-router-dom";
import { UserInitialStateType } from "../store/slice/userSlice";

const UserDropdown = ({
  userReducer,
  onClickLogout,
}: {
  userReducer: UserInitialStateType;
  onClickLogout: () => void;
}) => (
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
export default UserDropdown;
