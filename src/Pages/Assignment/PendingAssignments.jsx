import React, { useEffect, useState } from "react";
import { FaClock, FaMarker } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Firebase/firebase.config";

const PendingAssignments = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [obtainedMark, setObtainedMark] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUserEmail = user?.email;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          "https://groupstudy.vercel.app/api/pending-submissions",
          {
            withCredentials: true,
          }
        );
        setAssignments(res.data);
      } catch (error) {
        console.error("Error fetching pending submissions:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load",
          text: "Unable to fetch pending assignments.",
        });
      }
    };

    if (!loadingUser) {
      fetchAssignments();
    }
  }, [currentUserEmail, loadingUser]);

  const openModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setObtainedMark("");
    setFeedback("");
  };

  const handleSubmitMark = async () => {
    if (!currentUserEmail) {
      return Swal.fire({
        icon: "error",
        title: "Missing Email",
        text: "Current user email is not available.",
      });
    }

    if (
      selectedAssignment.createdBy?.trim().toLowerCase() ===
      currentUserEmail.trim().toLowerCase()
    ) {
      return Swal.fire({
        icon: "error",
        title: "Not Allowed",
        text: "You cannot evaluate your own assignment.",
      });
    }

    const numericMark = Number(obtainedMark);

    if (isNaN(numericMark) || numericMark < 0 || numericMark > 100) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Mark",
        text: "Please enter a valid mark between 0 and 100.",
      });
    }

    try {
      setLoading(true);
      await axios.post(
        "https://groupstudy.vercel.app/api/submit-mark",
        {
          submissionId: selectedAssignment._id,
          evaluatedBy: currentUserEmail,
          obtainedMark: numericMark,
          feedback,
        },
        {
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Mark Submitted",
        text: "The mark has been successfully submitted.",
      });

      setAssignments((prev) =>
        prev.filter((a) => a._id !== selectedAssignment._id)
      );
      closeModal();
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Failed to submit mark. Try again.";

      Swal.fire({
        icon: "error",
        title: status === 403 ? "Not Allowed" : "Submission Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <div className="text-center py-10">Loading user info...</div>;
  }

  return (
    <section className="min-h-screen px-4 md:px-10 lg:px-20 py-12 bg-base-100 text-base-content">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center flex justify-center items-center gap-2">
        <FaClock className="text-primary" />
        Pending Assignments
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full text-center">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Total Marks</th>
              <th>Examinee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-gray-500">
                  No pending assignments to evaluate.
                </td>
              </tr>
            ) : (
              assignments.map((assignment, index) => (
                <tr className="hover" key={assignment._id}>
                  <td>{index + 1}</td>
                  <td>{assignment.title}</td>
                  <td>{assignment.marks || "N/A"}</td>
                  <td>{assignment.createdBy}</td>
                  <td>
                    <button
                      onClick={() => openModal(assignment)}
                      className="btn btn-sm btn-primary flex items-center gap-2"
                    >
                      <FaMarker /> Give Mark
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold text-primary mb-4">
              Evaluate: {selectedAssignment.title}
            </h3>
            <p>
              <strong>Examinee:</strong> {selectedAssignment.createdBy}
            </p>
            <p>
              <strong>Google Docs:</strong>{" "}
              <a
                href={selectedAssignment.googleDocLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Submission
              </a>
            </p>
            <p>
              <strong>Note:</strong> {selectedAssignment.quickNote}
            </p>
            <p>
              <strong>Total Marks:</strong> {selectedAssignment.marks}
            </p>

            <input
              type="number"
              min="0"
              max="100"
              placeholder="Obtained marks out of 100"
              className="input input-bordered w-full my-4"
              value={obtainedMark}
              onChange={(e) => setObtainedMark(e.target.value)}
            />

            <textarea
              placeholder="Write feedback"
              className="textarea textarea-bordered w-full mb-4"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="btn btn-outline">
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitMark}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Mark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PendingAssignments;
