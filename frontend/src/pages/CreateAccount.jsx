import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function CreateAccount({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
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
      const res = await api.post("/users/register", formData);
      localStorage.setItem("token", res.data.token);

      const userRes = await api.get("/users/me");
      setUser(userRes.data);

      toast("Welcome to LangNote!", {
        icon: "📝",
        duration: 4000,
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account.");
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
              Create Account
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-bold">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ex: vlitz03"
                  className="input input-bordered w-full"
                  required
                  autoComplete="username"
                />
              </div>
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
                    autoComplete="new-password"
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
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold underline">
                  Log in
                </Link>
              </p>

              <div className="card-actions mt-6">
                <button
                  className="btn btn-primary text-primary-content w-full"
                  disabled={loading}
                >
                  {loading ? "Working on it..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
