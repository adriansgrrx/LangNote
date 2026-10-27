import React from "react";
import { Link, useNavigate } from "react-router";
import { Plus, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-base-100/85 backdrop-blur-md border-b border-base-content/10">
      <nav className="mx-auto max-w-6xl px-4 py-3 md:py-4" aria-label="Main">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            id="nav-home"
            className="flex items-center gap-2 hover:opacity-85 transition-opacity rounded-lg"
            aria-label="LangNote home"
          >
            <img src="/assets/langnote_48.png" alt="LangNote logo" className="size-8 md:size-9" />
            <span className="text-2xl md:text-3xl font-extrabold text-primary font-mono tracking-tighter">
              LangNote
            </span>
          </Link>

          <div className="flex items-center gap-1.5 md:gap-3">
            <ThemeSwitcher />

            {user ? (
              <>
                <Link
                  to="/create"
                  id="nav-new-note"
                  className="btn btn-primary btn-sm md:btn-md text-sm md:text-base text-primary-content font-semibold font-mono gap-1.5 tracking-wide shadow-sm hover:shadow-md"
                  aria-label="Create a new note"
                >
                  <Plus className="size-4 md:size-5" />
                  <span className="hidden sm:inline">New Note</span>
                </Link>

                {/* Avatar Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    id="nav-account-menu"
                    aria-label={`Account menu for ${user.username}`}
                    className="avatar online placeholder cursor-pointer"
                  >
                    <div className="bg-neutral text-neutral-content size-9 md:size-11 rounded-full ring-2 ring-transparent hover:ring-primary/50 transition">
                      <span className="text-sm md:text-base font-bold font-mono">
                        {user.username?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow-xl ring-1 ring-base-content/10 rounded-box w-56 mt-3 z-50 bg-base-200 font-mono"
                  >
                    <li className="menu-title px-2 pt-1 pb-0 text-base-content">
                      {user.username}
                    </li>
                    <li className="text-xs text-base-content/70 px-2 pb-2 mb-1 truncate border-b border-base-content/10">
                      {user.email}
                    </li>
                    <li>
                      <button
                        id="nav-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-error"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link
                to="/register"
                id="nav-get-started"
                className="btn btn-primary btn-sm md:btn-md text-sm md:text-base text-primary-content font-semibold font-mono tracking-wide"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
