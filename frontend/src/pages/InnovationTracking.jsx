import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function InnovationDashboard() {
  const [innovations, setInnovations] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    domain: "",
    level: "",
    status: "draft",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchInnovations = async () => {
    try {
      const res = await fetch("https://riise.koyeb.app/api/v1/innovations/", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      console.log("data: " , data);
      
      setInnovations(data);
    } catch (err) {
      console.error("Error fetching innovations:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://riise.koyeb.app/api/v1/innovations/update-innovation/${editingId}`
      : "https://riise.koyeb.app/api/v1/innovations/add-innovation";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.ok) {
        alert(editingId ? "Innovation updated!" : "Innovation added!");
        setForm({
          title: "",
          description: "",
          domain: "",
          level: "",
          status: "draft",
        });
        setEditingId(null);
        fetchInnovations();
      } else {
        alert(result.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (innovation) => {
    setForm({
      title: innovation.title,
      description: innovation.description,
      domain: innovation.domain,
      level: innovation.level,
      status: innovation.status,
    });
    setEditingId(innovation.innovation_id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      const res = await fetch(`https://riise.koyeb.app/api/v1/innovations/delete-innovation/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert("Innovation deleted!");
        fetchInnovations();
      } else {
        alert(result.error || "Deletion failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchInnovations();
  }, []);

  return (
    <div>
      <Navbar/>
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Innovation Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow"
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="domain"
          placeholder="Domain"
          value={form.domain}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="level"
          placeholder="Level"
          value={form.level}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="col-span-2 border p-2 rounded resize-none"
        ></textarea>
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"} Innovation
        </button>
      </form>

      <div className="grid gap-4 mt-8">
        {innovations.map((i) => (
          <div
            key={i.innovation_id}
            className="bg-white shadow p-4 rounded-2xl border"
          >
            <h2 className="text-xl font-bold">{i.title}</h2>
            <p className="text-sm text-gray-600">
              {i.domain} | Level: {i.level} | Status: {i.status}
            </p>
            <p className="mt-2">{i.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              Submitted on: {new Date(i.submitted_on).toLocaleDateString()}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(i)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i.innovation_id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
