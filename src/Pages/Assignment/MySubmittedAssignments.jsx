import React, { useEffect, useState, useContext } from "react";
import { FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/AuthProvider";

const MySubmittedAssignments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(
          "https://groupstudy.vercel.app/api/assignments"
        );
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        console.error(err);
        Swal.fire(
          "Error",
          err.message || "Failed to load assignments",
          "error"
        );
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        if (!user || !user.email) throw new Error("User not logged in");

        await fetch("https://groupstudy.vercel.app/jwt", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        const res = await fetch(
          "https://groupstudy.vercel.app/api/my-submitted-assignments",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok)
          throw new Error("Failed to fetch your submitted assignments");

        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMySubmissions();
    } else {
      setLoading(false);
      setSubmissions([]);
    }
  }, [user]);

  const getAssignmentInfo = (assignmentId) => {
    if (!assignmentId) return { title: "Unknown", marks: "—" };

    const idStr =
      typeof assignmentId === "string"
        ? assignmentId
        : assignmentId.$oid || assignmentId.toString();

    const assignment = assignments.find((a) => {
      const aIdStr =
        typeof a._id === "string" ? a._id : a._id?.$oid || a._id?.toString();
      return aIdStr === idStr;
    });

    return {
      title: assignment ? assignment.title : "Unknown",
      marks: assignment ? assignment.marks : "—",
    };
  };

  return (
    <section className="min-h-screen px-4 md:px-10 lg:px-20 py-12 bg-base-100 text-base-content">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center flex justify-center items-center gap-2">
        <FaClipboardList className="text-primary" />
        My Submitted Assignments
      </h2>

      {loading ? (
        <div className="text-center py-12 text-lg">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 text-lg text-red-600">
          You haven’t submitted any assignments yet.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="table w-full text-center">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th>#</th>
                <th>Assignment Title</th>
                <th>Status</th>
                <th>Total Marks</th>
                <th>Obtained Marks</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item, index) => {
                const { title, marks } = getAssignmentInfo(item.assignmentId);
                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{title}</td>
                    <td>
                      <span
                        className={`font-semibold ${
                          item.status === "completed"
                            ? "text-green-600"
                            : "text-yellow-500"
                        }`}
                      >
                        {item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)}
                      </span>
                    </td>
                    <td>{marks}</td>
                    <td>
                      {item.status === "completed" ? item.obtainedMark : "—"}
                    </td>
                    <td>{item.status === "completed" ? item.feedback : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MySubmittedAssignments;
