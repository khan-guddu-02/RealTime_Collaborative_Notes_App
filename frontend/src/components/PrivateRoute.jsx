import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // wait for user
  if (loading) {
    return <p>Loading...</p>;
  }

  //  not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}