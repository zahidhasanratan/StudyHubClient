import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaPlusCircle } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebase.config";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const CreateAssignment = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    marks: "",
    thumbnail: "",
    difficulty: "easy",
    dueDate: new Date(),
  });

  useEffect(() => {
    if (!loading && !user) {
      Swal.fire({
        icon: "info",
        title: "Please login first",
        text: "You must be logged in to access this page.",
        timer: 2500,
        showConfirmButton: false,
        position: "center",
      }).then(() => {
        navigate("/login", { replace: true });
      });
    }
  }, [user, loading, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: date,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required.",
      });
      return false;
    }
    if (!formData.description.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Description is required.",
      });
      return false;
    }
    if (formData.description.trim().length < 20) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Description must be at least 20 characters.",
      });
      return false;
    }
    if (formData.marks === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Total marks is required.",
      });
      return false;
    }
    if (isNaN(formData.marks)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Total marks must be a number.",
      });
      return false;
    }
    if (Number(formData.marks) < 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Total marks cannot be negative.",
      });
      return false;
    }
    if (!formData.thumbnail.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Thumbnail URL is required.",
      });
      return false;
    }
    const urlPattern =
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i;
    if (!urlPattern.test(formData.thumbnail)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please enter a valid URL.",
      });
      return false;
    }
    if (!formData.difficulty) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Difficulty level is required.",
      });
      return false;
    }
    if (!formData.dueDate) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Due date is required.",
      });
      return false;
    }
    return true;
  };

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData) => {
      const response = await fetch(
        "https://groupstudy.vercel.app/assignments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(assignmentData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create assignment");
      }
      return response.json();
    },
    onSuccess: async () => {
      await Swal.fire({
        icon: "success",
        title: "Assignment Created",
        text: "Your assignment was created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/assignments");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const assignmentData = {
      ...formData,
      marks: Number(formData.marks),
    };

    createAssignmentMutation.mutate(assignmentData);
  };

  if (loading || !user) {
    return null;
  }

  return (
    <section className="min-h-screen px-4 py-12 md:px-12 lg:px-24 bg-base-100 text-base-content">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-primary text-center flex justify-center items-center gap-2">
          <FaPlusCircle />
          Create New Assignment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-base-200 p-8 rounded-xl shadow-md space-y-6"
          aria-label="Create Assignment Form"
          noValidate
        >
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full"
              placeholder="Enter assignment title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="textarea textarea-bordered w-full"
              placeholder="Enter assignment description"
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="marks" className="block font-medium mb-1">
                Total Marks
              </label>
              <input
                id="marks"
                name="marks"
                type="number"
                value={formData.marks}
                onChange={handleInputChange}
                required
                min={0}
                className="input input-bordered w-full"
                placeholder="Total marks"
              />
            </div>

            <div>
              <label htmlFor="thumbnail" className="block font-medium mb-1">
                Thumbnail URL
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="url"
                value={formData.thumbnail}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="difficulty" className="block font-medium mb-1">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block font-medium mb-1">
                Due Date
              </label>
              <DatePicker
                id="dueDate"
                selected={formData.dueDate}
                onChange={handleDateChange}
                className="input input-bordered w-full"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6 text-lg font-semibold"
            disabled={createAssignmentMutation.isLoading}
          >
            {createAssignmentMutation.isLoading
              ? "Creating..."
              : "Create Assignment"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateAssignment;
