import { Link, useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext.jsx";

export default function Navbar() {
  const { auth, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">📷 PhotoShare</Link>
      </div>
      <div className="flex-none gap-2">
        {auth ? (
          <>
            <Link to="/" className="btn btn-ghost btn-sm">Gallery</Link>
            <Link to="/profile" className="btn btn-ghost btn-sm">Profile</Link>
            {isAdmin && <Link to="/admin" className="btn btn-ghost btn-sm">Admin</Link>}
            <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate("/login"); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
          </>
        )}
      </div>
    </div>
  );
}
