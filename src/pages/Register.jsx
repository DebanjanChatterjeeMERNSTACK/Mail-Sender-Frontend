import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AUTH } from "../config/api";
import { toast } from "react-toastify";
import { BadgeInfo, X } from "lucide-react";
import guideImage1 from "../assets/image1.png";
import guideImage2 from "../assets/image2.png";
import guideImage3 from "../assets/image3.png";
import guideImage4 from "../assets/image4.png";

const Register = () => {
  const data = [
    {
      title: "Open security & sign-in settings and 2-step verification ",
      image: guideImage1,
    },
    {
      title: "Search app password",
      image: guideImage2,
    },
    {
      title: "Create App Name",
      image: guideImage3,
    },
    {
      title: "Copy the generated App Password",
      image: guideImage4,
    },
  ];

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    appPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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

      const response = await fetch(AUTH.Register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          appPassword: formData.appPassword,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success(data.message || "Registration successful");

      setFormData({
        name: "",
        email: "",
        password: "",
        appPassword: "",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => setIsGuideOpen(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-3">
        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>

          <p className="text-gray-500 mt-2">Register your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* App Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Google App Password
            </label>

            <input
              type="password"
              name="appPassword"
              value={formData.appPassword}
              onChange={handleChange}
              placeholder="Enter Google App password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleClick}
              className="flex items-center text-blue-500 cursor-pointer font-medium gap-1 text-sm hover:text-blue-700"
            >
              <BadgeInfo size={15} />
              how to find it
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </NavLink>
        </p>
      </div>

      {isGuideOpen && (
        <div
          role="presentation"
          onClick={() => setIsGuideOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-password-guide-title"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
              <div className="min-w-0">
                <h2
                  id="app-password-guide-title"
                  className="text-lg font-bold text-gray-800 sm:text-xl"
                >
                  How to find your app password
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Follow these four steps to create an app password.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close guide"
                onClick={() => setIsGuideOpen(false)}
                className="shrink-0 rounded-full p-2 cursor-pointer text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {data.map((step, index) => (
                  <div
                    key={step.title}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <img
                      src={step.image}
                      alt={`Step ${index + 1}: ${step.title}`}
                      className="h-48 w-full object-cover sm:h-44 md:h-40"
                    />

                    <p className="px-4 py-3 text-sm font-medium leading-5 text-gray-700">
                      {index + 1}. {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
