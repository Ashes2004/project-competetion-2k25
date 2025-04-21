import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_BASE = "https://riise.koyeb.app/api/v1/research";

const ResearchForm = () => {
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id");
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    authors: "",
    publication_date: "",
    doi: "",
    status: "Pending",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (editingId) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/${editingId}`, {
            credentials: "include",
          });
          const data = await res.json();
          setForm(data);
        } catch (err) {
          console.error("Error fetching paper:", err);
        }
      })();
    }
  }, [editingId]);

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
      navigate("/research");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          {editingId ? "Edit Paper" : "Add New Research Paper"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 space-y-5 border border-gray-200"
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
      </div>
    </>
  );
};

export default ResearchForm;
