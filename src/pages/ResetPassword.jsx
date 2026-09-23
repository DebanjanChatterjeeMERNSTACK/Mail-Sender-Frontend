
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AUTH } from "../config/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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


    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${AUTH.ResetPassword}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Password reset failed");
        return;
      }

      toast.success(data.message || "Password reset successfully");

      setFormData({
        password: "",
        confirmPassword: "",
      });

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
            Reset Password
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your new password below.
          </p>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400 text-white font-semibold
            py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {/* Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            ← Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;

