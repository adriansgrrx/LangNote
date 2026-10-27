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
          <div className="flex gap-2">
            <img src="/assets/langnote.png" alt="logo" className="size-8 md:size-9 lg:size-9 xl:size-9" />
            <h1 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-primary font-mono tracking-tighter">
              LangNote
            </h1>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/create"
                className="btn btn-primary btn-sm md:btn-md lg:btn-md xl:btn-md text-sm md:text-lg lg:text-lg xl:text-lg text-amber-100 font-medium font-mono gap-2 tracking-wide"
              >
                <span>New Note</span>
                <Plus className="size-5" />
              </Link>

              {/* Avatar Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  className="avatar online placeholder cursor-pointer"
                >
                  <div className="bg-neutral text-neutral-content size-8 md:size-12 lg:size-12 xl:size-12 rounded-full">
                    <span className="text-sm lg:text-lg xl:text-lg">
                      {user.username?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-xl ring-1 ring-black/10 rounded-box w-44 mt-4 z-50 bg-base-200"
                >
                  <li className="text-xs text-gray-500 px-2 py-1 mb-4">
                    {user.email}
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-primary btn-sm text-sm text-amber-100 flex items-center gap-2 "
                    >
                      <LogOut className="size-3" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              to="/register"
              className="btn btn-primary btn-sm md:btn-md lg:btn-md xl:btn-md text-sm md:text-lg lg:text-lg xl:text-lg text-amber-100 font-medium font-mono gap-2 tracking-wide"
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
