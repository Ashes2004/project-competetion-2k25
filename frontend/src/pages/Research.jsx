import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE = "https://riise.koyeb.app/api/v1/research";

const Research = () => {
  const [papers, setPapers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchPapers = async () => {
    try {
      const res = await fetch(`${API_BASE}/`, {
        credentials: "include",
      });
      const data = await res.json();
      setPapers(data);
    } catch (err) {
      console.error("Error fetching papers:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this paper?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete-paper/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      setMessage(data.message);
      fetchPapers();
    } catch (err) {
      console.error("Error deleting paper:", err);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  return (
    <div className="bg-[#0f172a]">
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-gray-100 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-white">📘 Research Dashboard</h1>
            <button
              onClick={() => navigate("/research/form")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition"
            >
              ➕ New Research Paper
            </button>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-700/20 text-green-400 rounded-lg text-center shadow">
              {message}
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-6 text-gray-200">Your Papers</h2>

          {papers.length === 0 ? (
            <div className="text-gray-400 text-center py-10">
              No research papers found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map((paper) => (
                <div
                  key={paper.paper_id}
                  className="bg-[#1e293b] border border-blue-900/40 shadow-lg hover:shadow-blue-800/30 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-1">
                      <strong>Authors:</strong> {paper.authors}
                    </p>
                    <p className="text-sm text-gray-300 mb-1">
                      <strong>DOI:</strong> {paper.doi}
                    </p>
                    <p className="text-sm mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          paper.status === "Published"
                            ? "bg-green-700 text-green-200"
                            : "bg-yellow-700 text-yellow-100"
                        }`}
                      >
                        {paper.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() =>
                        navigate(`/research/form?id=${paper.paper_id}`)
                      }
                      className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(paper.paper_id)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Research;
