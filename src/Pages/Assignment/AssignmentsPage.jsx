import React, { useEffect, useState, useContext } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaBook } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // New states for filter and search
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  // Fetch assignments with filter and search parameters
  const fetchAssignments = async (difficulty = "", search = "") => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (difficulty) params.append("difficulty", difficulty);
      if (search) params.append("search", search);

      const res = await fetch(
        `https://groupstudy.vercel.app/allassignments?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to load assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initially and whenever filter/search changes
  useEffect(() => {
    fetchAssignments(difficultyFilter, searchTerm);
  }, [difficultyFilter, searchTerm]);

  const handleDelete = async (id) => {
    if (!userEmail) {
      Swal.fire("Unauthorized", "You must be logged in", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `https://groupstudy.vercel.app/allassignments/${id}?email=${userEmail}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Delete failed");

        setAssignments(assignments.filter((a) => a._id !== id));
        Swal.fire("Deleted!", "The assignment has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Failed to delete", "error");
      }
    }
  };

  return (
    <section className="px-4 md:px-10 lg:px-20 py-10 min-h-screen bg-base-100 text-base-content">
      <h1 className="text-3xl font-bold text-primary mb-6 flex justify-center items-center gap-2 text-center">
        <FaBook className="text-primary" />
        All Assignments
      </h1>

      {/* Filter and Search Controls */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
        <select
          className="select select-bordered w-48 max-w-xs"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input
          type="text"
          placeholder="Search by title..."
          className="input input-bordered w-64 max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-lg">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 text-lg">No assignments found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-base-200 rounded-2xl shadow p-5 flex flex-col"
            >
              <img
                src={assignment.thumbnail}
                alt={assignment.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-primary mb-2">
                {assignment.title}
              </h2>
              <p className="mb-2 text-sm text-gray-500 line-clamp-2">
                {assignment.description}
              </p>
              <div className="text-sm text-gray-700 mb-4">
                <span className="block">Total Marks: {assignment.marks}</span>
                <span className="block">
                  Difficulty:{" "}
                  <span
                    className={`font-medium ${
                      assignment.difficulty === "easy"
                        ? "text-green-600"
                        : assignment.difficulty === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {assignment.difficulty.charAt(0).toUpperCase() +
                      assignment.difficulty.slice(1)}
                  </span>
                </span>
                <span className="block">
                  Due Date:{" "}
                  <span className="font-medium">
                    {new Date(assignment.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>

              <div className="mt-auto flex justify-between gap-3 pt-2">
                <button
                  onClick={() => handleDelete(assignment._id)}
                  className="btn btn-error btn-sm flex-1 flex items-center gap-1"
                >
                  <FaTrashAlt />
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/update/${assignment._id}`)}
                  className="btn btn-warning btn-sm flex-1 flex items-center gap-1"
                >
                  <FaEdit />
                  Update
                </button>
                <button
                  onClick={() => navigate(`/view/${assignment._id}`)}
                  className="btn btn-info btn-sm flex-1 flex items-center gap-1"
                >
                  <FaEye />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AssignmentsPage;
