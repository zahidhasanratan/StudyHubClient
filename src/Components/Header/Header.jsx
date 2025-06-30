import { FaMoon, FaSun, FaBookOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";
import Swal from "sweetalert2";

export const Header = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Theme setup on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Logged out", "You have been logged out.", "success");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="navbar bg-base-100/80 backdrop-blur shadow-md border-b border-base-300 px-4 md:px-12 lg:px-20 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2"
        >
          <FaBookOpen className="text-primary w-6 h-6" />
          GroupStudyHub
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        <ul className="menu menu-horizontal px-1 text-lg font-medium">
          <li>
            <Link to="/assignments">Assignments</Link>
          </li>
          {user && (
            <li>
              <Link to="/pending">Pending</Link>
            </li>
          )}
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className="dropdown dropdown-end md:hidden">
        <button tabIndex={0} className="btn btn-ghost p-1">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box min-w-[150px] max-w-[90vw]"
          style={{ width: "max-content" }}
        >
          <li>
            <Link to="/assignments">Assignments</Link>
          </li>
          {user && (
            <li>
              <Link to="/pending">Pending</Link>
            </li>
          )}
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
        </ul>
      </div>

      {/* Theme Toggle + Auth Control */}
      <div className="flex items-center gap-4 ml-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-outline p-1"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <FaMoon className="w-5 h-5" />
          ) : (
            <FaSun className="w-5 h-5" />
          )}
        </button>

        {/* Auth */}
        {!user ? (
          <Link to="/login" className="btn btn-sm btn-outline p-1">
            Login
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom p-0"
              data-tip={user.displayName || "User"}
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.photoURL || "https://i.pravatar.cc/100"}
                  alt="User Avatar"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/create-assignment">Create Assignment</Link>
              </li>
              <li>
                <Link to="/my-attempts">My Attempts</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
