import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FaPlusCircle } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const UpdateAssignmentPage = () => {
  const [user, loading] = useAuthState(auth);
  const [formData, setFormData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const updateAssignmentMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(
        `https://groupstudy.vercel.app/assignments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to update assignment");
      }
      return response.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Assignment Updated",
        text: "The assignment was updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/assignments");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
      });
    },
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
      return;
    }

    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `https://groupstudy.vercel.app/assignments/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to load assignment");
        const data = await res.json();
        data.dueDate = new Date(data.dueDate);
        setFormData(data);

        if (user && data.createdBy === user.email) {
          setIsCreator(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You are not allowed to update this assignment.",
            confirmButtonText: "Go Back",
          }).then(() => navigate("/assignments"));
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
        });
      }
    };

    if (user) {
      fetchAssignment();
    }
  }, [user, loading, id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const isValidDifficulty = (value) => {
    return ["easy", "medium", "hard"].includes(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Title is required.",
      });
    }
    if (!formData.description || formData.description.trim().length < 20) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Description should be at least 20 characters long.",
      });
    }
    if (
      !formData.marks ||
      isNaN(formData.marks) ||
      Number(formData.marks) < 0
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Marks must be a number greater than or equal to 0.",
      });
    }
    if (!formData.thumbnail || !isValidUrl(formData.thumbnail)) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid URL for the thumbnail.",
      });
    }
    if (!isValidDifficulty(formData.difficulty)) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select a valid difficulty level.",
      });
    }
    if (
      !formData.dueDate ||
      !(formData.dueDate instanceof Date) ||
      isNaN(formData.dueDate)
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select a valid due date.",
      });
    }

    const now = new Date();
    if (formData.dueDate < now) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Due date cannot be in the past.",
      });
    }

    // Prepare data
    const payload = {
      ...formData,
      marks: Number(formData.marks),
      dueDate: formData.dueDate.toISOString(),
      currentUserEmail: user.email,
    };

    updateAssignmentMutation.mutate(payload);
  };

  if (loading || !user || !formData || !isCreator) return null;

  return (
    <section className="min-h-screen px-4 py-12 md:px-12 lg:px-24 bg-base-100 text-base-content">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-primary text-center flex justify-center items-center gap-2">
          <FaPlusCircle />
          Update Assignment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-base-200 p-8 rounded-xl shadow-md space-y-6"
          aria-label="Update Assignment Form"
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
            disabled={updateAssignmentMutation.isLoading}
          >
            {updateAssignmentMutation.isLoading
              ? "Updating..."
              : "Update Assignment"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateAssignmentPage;
