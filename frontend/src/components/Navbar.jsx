import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Notes App</span>

      <div>
        <span className="text-white me-3">
          {user?.name} ({user?.role})
        </span>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;