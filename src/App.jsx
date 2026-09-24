import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const MailTemplete = lazy(() => import("./pages/MailTemplete"));

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MailTemplete />} />
          </Route>

          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
