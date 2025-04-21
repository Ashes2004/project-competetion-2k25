import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar"

const API_BASE = "https://riise.koyeb.app/api/v1/research";

const Research = () => {
  const [papers, setPapers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    authors: "",
    publication_date: "",
    doi: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editingId ? `/update-paper/${editingId}` : "/add-paper";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || "Action successful");
      setForm({
        title: "",
        abstract: "",
        authors: "",
        publication_date: "",
        doi: "",
        status: "Pending",
      });
      setEditingId(null);
      fetchPapers();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleEdit = (paper) => {
    setForm({ ...paper });
    setEditingId(paper.paper_id);
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

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Research Dashboard
        </h1>

        {message && (
          <div className="mb-6 text-center text-green-700 font-medium">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 mb-10 space-y-5 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-3 border rounded-md"
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              className="p-3 border rounded-md"
              type="text"
              name="authors"
              placeholder="Authors"
              value={form.authors}
              onChange={handleChange}
            />
            <input
              className="p-3 border rounded-md"
              type="date"
              name="publication_date"
              value={form.publication_date}
              onChange={handleChange}
            />
            <input
              className="p-3 border rounded-md"
              type="text"
              name="doi"
              placeholder="DOI"
              value={form.doi}
              onChange={handleChange}
            />
            <select
              className="p-3 border rounded-md"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>Published</option>
              <option>Rejected</option>
            </select>
          </div>
          <textarea
            className="w-full p-3 border rounded-md"
            name="abstract"
            placeholder="Abstract"
            rows={4}
            value={form.abstract}
            onChange={handleChange}
          ></textarea>
          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded-lg font-semibold transition-all"
          >
            {editingId ? "Update Paper" : "Add Paper"}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Research Papers
        </h2>
        <div className="grid gap-6">
          {papers.map((paper) => (
            <div
              key={paper.paper_id}
              className="bg-white shadow-md border border-gray-200 p-6 rounded-lg flex justify-between items-start hover:shadow-xl transition-shadow"
            >
              <div>
                <h3 className="text-xl font-bold">{paper.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Authors:</strong> {paper.authors}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>DOI:</strong> {paper.doi}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {paper.status}
                </p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => handleEdit(paper)}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(paper.paper_id)}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Research;
