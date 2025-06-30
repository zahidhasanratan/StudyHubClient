import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaGoogle } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../Firebase/firebase.config"; // ✅ Correct import

const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photo.value;
    const password = form.password.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters with uppercase and lowercase letters."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name, photoURL });

      const token = await userCredential.user.getIdToken();
      console.log("✅ Firebase Access Token (ID Token):", token);

      Swal.fire("Success!", "Registration successful", "success");
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const token = await user.getIdToken();
      console.log("✅ Firebase Access Token (ID Token):", token);

      Swal.fire("Success!", "Logged in with Google", "success");
      navigate("/");
    } catch (err) {
      console.error("Google Sign-in Error:", err);
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-0">
      <div className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="photo"
            placeholder="Photo URL"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleRegister}
          className="btn btn-outline w-full flex items-center gap-2"
        >
          <FaGoogle /> Continue with Google
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
