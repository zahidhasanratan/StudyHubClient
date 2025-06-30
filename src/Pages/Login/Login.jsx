import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const Login = ({ onToken }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from) {
      Swal.fire({
        icon: "info",
        title: "Please login first",
        text: "You must be logged in to access that page.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();

      // Send to backend
      await fetch("https://groupstudy.vercel.app/jwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      Swal.fire("Success!", "Logged in successfully", "success");
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get Firebase ID Token (JWT)
      const token = await user.getIdToken();
      console.log("✅ Firebase Access Token (ID Token):", token);

      // Pass token to parent or wherever needed
      if (onToken) onToken(token);

      Swal.fire("Success!", "Logged in with Google", "success");
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-base-100 text-base-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-base-200 p-8 rounded-xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label className="label font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              className="input input-bordered w-full"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            className="btn btn-primary w-full text-lg mt-4"
            type="submit"
            aria-label="Login"
          >
            Login
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center justify-center gap-2 text-sm font-medium"
          aria-label="Login with Google"
        >
          <FaGoogle className="text-red-500" /> Login with Google
        </button>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
