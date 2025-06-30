import React from "react";
import { Link } from "react-router-dom";
import { Header } from "../Components/Header/Header";
import { Footer } from "../Components/Footer/Footer";
import { motion } from "framer-motion";

export const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <motion.div
          className="text-center max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>
          <p className="text-2xl font-semibold mb-2">Oops! Page Not Found</p>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-xl font-medium transition duration-300 shadow-md"
          >
            ⬅ Back to Home
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
