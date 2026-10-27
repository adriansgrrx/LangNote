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
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 font-mono" aria-label="LangNote home">
          <img src="/assets/langnote.png" alt="" className="size-9" />
          <span className="text-3xl font-extrabold text-primary tracking-tighter">LangNote</span>
        </Link>
        <div className="card bg-base-100 shadow-md border border-base-content/10 font-mono">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-center">
              Create your account
            </h1>
            <p className="text-sm text-base-content/60 text-center mb-4">Start capturing your ideas in seconds.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label" htmlFor="register-username">
                  <span className="label-text font-bold">Username</span>
                </label>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ex: vlitz03"
                  className="input input-bordered w-full focus:input-primary"
                  required
                  autoComplete="username"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label" htmlFor="register-email">
                  <span className="label-text font-bold">Email</span>
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ex: user@example.com"
                  className="input input-bordered w-full focus:input-primary"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label" htmlFor="register-password">
                  <span className="label-text font-bold">Password</span>
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className="input input-bordered w-full pr-10 focus:input-primary"
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

              <div className="card-actions mt-6">
                <button
                  id="register-submit"
                  type="submit"
                  className="btn btn-primary text-primary-content w-full"
                  disabled={loading}
                >
                  {loading ? <><span className="loading loading-spinner loading-sm" /> Creating account...</> : "Register"}
                </button>
              </div>

              <p className="text-center text-sm mt-6 text-base-content/70">
                Already have an account?{" "}
                <Link to="/login" id="register-to-login" className="link link-hover text-base-content font-bold">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateAccount;
