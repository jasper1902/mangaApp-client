import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode;
  role: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, role }) => {
  return role === "admin" ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
