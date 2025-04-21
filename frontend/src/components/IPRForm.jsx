import { useState, useEffect } from "react";

const IPRForm = ({ onSubmit, editingIPR }) => {
  const [form, setForm] = useState({
    ipr_type: "",
    title: "",
    ipr_number: "",
    filing_date: "",
    status: "",
    related_startup_id: "",
  });

  useEffect(() => {
    if (editingIPR) {
      setForm({ ...editingIPR });
    }
  }, [editingIPR]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      ipr_type: "",
      title: "",
      ipr_number: "",
      filing_date: "",
      status: "",
      related_startup_id: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <input type="text" name="ipr_type" placeholder="IPR Type" className="input" value={form.ipr_type} onChange={handleChange} required />
      <input type="text" name="title" placeholder="Title" className="input" value={form.title} onChange={handleChange} required />
      <input type="text" name="ipr_number" placeholder="IPR Number" className="input" value={form.ipr_number} onChange={handleChange} />
      <input type="date" name="filing_date" className="input" value={form.filing_date} onChange={handleChange} />
      <input type="text" name="status" placeholder="Status" className="input" value={form.status} onChange={handleChange} />
      <input type="number" name="related_startup_id" placeholder="Related Startup ID" className="input" value={form.related_startup_id} onChange={handleChange} />

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        {editingIPR ? "Update IPR" : "Add IPR"}
      </button>
    </form>
  );
};

export default IPRForm;