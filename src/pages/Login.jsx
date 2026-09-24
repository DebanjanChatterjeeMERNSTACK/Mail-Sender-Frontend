
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AUTH } from "../config/api";
import { toast } from "react-toastify";

const Login = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        AUTH.Login,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      // Save token if backend returns JWT
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message || "Login successful");

      setFormData({
        email:"",
        password:""
      })

      navigate("/")

    } catch (error) {
      console.log(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Login to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <NavLink
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400 text-white font-semibold
            py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}

          <NavLink
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </NavLink>
        </p>

      </div>
    </div>
  );
};

export default Login;
