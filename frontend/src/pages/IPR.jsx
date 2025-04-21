import { useEffect, useState } from "react";
import IPRForm from "../components/IPRForm";
import IPRList from "../components/IPRList";
import { getAllIPRs, createIPR, updateIPR, deleteIPR } from "../api/IPR";
import Navbar from "../components/Navbar";

const userId = 1; // mock or from auth context

const IPR = () => {
  const [iprs, setIprs] = useState([]);
  const [editingIPR, setEditingIPR] = useState(null);

  const fetchIPRs = async () => {
    const res = await getAllIPRs();
    setIprs(res.data);
  };

  const handleCreateOrUpdate = async (data) => {
    if (editingIPR) {
      await updateIPR(editingIPR.ipr_id, data);
      setEditingIPR(null);
    } else {
      await createIPR({ ...data, user_id: userId });
    }
    fetchIPRs();
  };

  const handleDelete = async (id) => {
    await deleteIPR(id);
    fetchIPRs();
  };

  const handleEdit = (ipr) => {
    setEditingIPR(ipr);
  };

  useEffect(() => {
    fetchIPRs();
  }, []);

  return (
    <div >
        <Navbar/>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Your IPRs</h1>
      <IPRForm onSubmit={handleCreateOrUpdate} editingIPR={editingIPR} />
      <IPRList iprs={iprs} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
    </div>
  );
};

export default IPR;
