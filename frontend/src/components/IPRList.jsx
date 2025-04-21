const IPRList = ({ iprs, onEdit, onDelete }) => {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">IPR Records</h2>
        <ul className="space-y-4">
          {iprs.map((ipr) => (
            <li key={ipr.ipr_id} className="p-4 bg-gray-100 rounded shadow flex justify-between items-start">
              <div>
                <p className="font-bold">{ipr.title}</p>
                <p>Type: {ipr.ipr_type}</p>
                <p>Status: {ipr.status || "N/A"}</p>
                <p>Date: {ipr.filing_date || "N/A"}</p>
                <p>Startup ID: {ipr.related_startup_id || "None"}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => onEdit(ipr)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(ipr.ipr_id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default IPRList;