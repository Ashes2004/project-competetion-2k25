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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        {editingIPR ? "Edit IPR Details" : "Add New IPR"}
      </h2>

      {[
        { name: "ipr_type", label: "IPR Type", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "ipr_number", label: "IPR Number", type: "text" },
        { name: "filing_date", label: "Filing Date", type: "date" },
        { name: "status", label: "Status", type: "text" },
        { name: "related_startup_id", label: "Related Startup ID", type: "number" },
      ].map(({ name, label, type }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">
            {label}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            placeholder={label}
            value={form[name]}
            onChange={handleChange}
            required={name === "ipr_type" || name === "title"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:shadow-lg transition duration-300 hover:from-blue-700 hover:to-indigo-700"
      >
        {editingIPR ? "Update IPR" : "Add IPR"}
      </button>
    </form>
  );
};

export default IPRForm;
