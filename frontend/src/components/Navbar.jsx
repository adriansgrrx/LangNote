import React from "react";
import { Link, useNavigate } from "react-router";
import { Plus, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="bg-base-100 border-base-content/10 top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <img src="/assets/langnote.png" alt="logo" className="size-8 md:size-9" />
            <span className="text-2xl md:text-3xl font-bold text-primary font-mono tracking-tighter">
              LangNote
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/create"
                className="btn btn-primary btn-sm md:btn-md text-sm md:text-base text-primary-content font-medium font-mono gap-1.5 tracking-wide"
              >
                <span>New Note</span>
                <Plus className="size-4 md:size-5" />
              </Link>

              {/* Avatar Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  className="avatar online placeholder cursor-pointer"
                >
                  <div className="bg-neutral text-neutral-content size-9 md:size-11 rounded-full">
                    <span className="text-sm md:text-base font-bold font-mono">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-xl ring-1 ring-black/10 rounded-box w-48 mt-4 z-50 bg-base-200 font-mono"
                >
                  <li className="text-xs text-base-content/70 px-2 py-1.5 mb-2 truncate">
                    {user.email}
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-primary btn-sm text-xs text-primary-content flex items-center gap-2 w-full"
                    >
                      <LogOut className="size-3.5" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              to="/register"
              className="btn btn-primary btn-sm md:btn-md text-sm md:text-base text-primary-content font-medium font-mono tracking-wide"
            >
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
