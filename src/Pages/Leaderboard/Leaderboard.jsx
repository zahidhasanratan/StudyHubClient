import React, { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import axios from "axios";

const Leaderboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          "https://groupstudy.vercel.app/api/leaderboard"
        );
        // backend already returns only evaluated submissions
        const evaluatedSubs = res.data.map((sub) => {
          let mark = 0;

          if (sub.obtainedMark) {
            if (
              typeof sub.obtainedMark === "object" &&
              sub.obtainedMark.$numberInt
            ) {
              mark = Number(sub.obtainedMark.$numberInt);
            } else if (typeof sub.obtainedMark === "number") {
              mark = sub.obtainedMark;
            } else {
              mark = Number(sub.obtainedMark) || 0;
            }
          }

          return {
            ...sub,
            mark,
            // Use backend photoURL if available, otherwise fallback to placeholder
            photoURL:
              sub.photoURL ||
              `https://i.pravatar.cc/40?u=${encodeURIComponent(sub.createdBy)}`,
            name: sub.createdBy,
            email: sub.createdBy,
            assignmentTitle: sub.assignmentTitle || "Untitled Assignment",
          };
        });

        evaluatedSubs.sort((a, b) => b.mark - a.mark);
        setSubmissions(evaluatedSubs);
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading leaderboard...</p>;
  }

  if (submissions.length === 0) {
    return (
      <p className="text-center mt-8 text-gray-500">
        No evaluated submissions yet.
      </p>
    );
  }

  return (
    <section className="min-h-screen px-4 md:px-10 lg:px-20 py-12 bg-base-100 text-base-content">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center flex justify-center items-center gap-2">
        <FaTrophy className="text-yellow-500" />
        Leaderboard
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="table w-full text-center">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Email</th>
              <th>Assignment Title</th>
              <th>Obtained Mark</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, index) => (
              <tr key={sub._id} className="hover">
                <td>{index + 1}</td>
                <td className="flex items-center justify-center gap-3 font-medium">
                  <img
                    src={sub.photoURL}
                    alt={sub.name}
                    className="w-10 h-10 rounded-full border-2 border-primary"
                  />
                  <span>{sub.name}</span>
                </td>
                <td>{sub.email}</td>
                <td>{sub.assignmentTitle}</td>
                <td className="font-bold text-green-600">{sub.mark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Leaderboard;
