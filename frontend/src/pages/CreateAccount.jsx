import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";

function CreateAccount({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CreateAccount.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/users/register", formData);

      // 1️⃣ Store token
      localStorage.setItem("token", res.data.token);

      // 2️⃣ Fetch full user profile (optional but safest)
      const userRes = await api.get("/users/me"); // token is auto-attached via interceptor
      setUser(userRes.data);

      // 3️⃣ Navigate to homepage
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="card bg-base-100 font-mono">
            <div className="card-body">
              <div className="card-title text-2xl mt-4 mb-4 justify-center">
                Create Account
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="ex: vlitz03"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ex: vltiz@example.com"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className="input input-bordered"
                    required
                  />
                </div>

                <p className="text-center text-sm mt-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-error font-medium">
                    Log in
                  </Link>
                </p>

                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary text-amber-100 w-full mt-4"
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
    </div>
  );
}

export default CreateAccount;
