
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AUTH } from "../config/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        AUTH.ForgetPassword,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success(
        data.message || "Password reset link has been sent to your email"
      );

      setEmail("");
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
            Forgot Password?
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
              outline-none focus:ring-2 focus:ring-blue-500
              focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400 text-white font-semibold
            py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <NavLink
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Login
          </NavLink>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
