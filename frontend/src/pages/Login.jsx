import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { Eye, EyeOff } from "lucide-react";

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!");
      setUser(res.data);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Failed to log in.", error);
        toast.error("Slow down! You're logging in many times in a row.", {
          duration: 4000,
          icon: "🚦",
        });
      } else {
        console.log("Failed to log in.", error);
        toast.error(error.response?.data?.message || "Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-md font-mono">
          <div className="card-body p-6 sm:p-8">
            <div className="card-title text-2xl mb-4 justify-center font-bold text-primary">
              Log In
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-bold">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ex: user@example.com"
                  className="input input-bordered w-full"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-bold">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className="input input-bordered w-full pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <p className="text-center text-sm mt-6">
                No account yet?{" "}
                <Link to={'/register'} className="text-primary font-bold underline">
                  Create account
                </Link>
              </p>

              <div className="card-actions mt-6">
                <button
                  className="btn btn-primary text-primary-content w-full"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
