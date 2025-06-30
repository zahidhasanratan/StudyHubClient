import React, { useState } from "react";
import Swal from "sweetalert2";

const AssignmentSubmissionModal = ({ assignmentId, userEmail, onClose }) => {
  const [googleDocLink, setGoogleDocLink] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUrl(googleDocLink)) {
      Swal.fire("Error", "Please enter a valid Google Docs link.", "error");
      return;
    }

    setSubmitting(true);

    const payload = {
      assignmentId,
      userEmail,
      googleDocLink,
      quickNote,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "https://groupstudy.vercel.app/submit-assignment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json(); // read error message

      if (!res.ok)
        throw new Error(result?.error || "Failed to submit assignment");

      Swal.fire("Success", "Assignment submitted successfully!", "success");
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Submission failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4">Submit Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="Google Docs Link"
            value={googleDocLink}
            onChange={(e) => setGoogleDocLink(e.target.value)}
            required
            className="input input-bordered w-full"
            disabled={submitting}
          />
          <textarea
            placeholder="Quick Note"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            className="textarea textarea-bordered w-full"
            disabled={submitting}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmissionModal;
