import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Provider/AuthProvider";
import Swal from "sweetalert2";
import AssignmentSubmissionModal from "./AssignmentSubmissionModal";

const ViewAssignment = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `https://groupstudy.vercel.app/assignments/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch assignment");
        const data = await res.json();
        setAssignment(data);
        document.title = `${data?.title || "Assignment"} - GroupStudyHub`;
      } catch (error) {
        Swal.fire("Error", "Could not load assignment", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!assignment) {
    return <div className="text-center py-10">Assignment not found.</div>;
  }

  // Destructure with fallbacks
  const {
    title = "Untitled",
    description = "No description available.",
    marks = "N/A",
    difficulty = "N/A",
    dueDate,
    thumbnail,
    createdBy = "Unknown",
  } = assignment;

  // Format due date if available
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="w-full max-h-[300px] object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
        <p>
          <strong>Total Marks:</strong> {marks}
        </p>
        <p>
          <strong>Difficulty:</strong>{" "}
          <span className="capitalize">{difficulty}</span>
        </p>
        <p>
          <strong>Due Date:</strong> {formattedDueDate}
        </p>
        <p>
          <strong>Created By:</strong> {createdBy}
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary w-full max-w-xs"
      >
        Take Assignment
      </button>

      {showModal && (
        <AssignmentSubmissionModal
          assignmentId={id}
          userEmail={user?.email}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ViewAssignment;
