import React from 'react';
import { deleteInnovation } from '../api/innovationService';

const InnovationList = ({ innovations, onSelect, onRefresh }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this innovation?')) {
      try {
        await deleteInnovation(id);
        onRefresh();
      } catch (error) {
        console.error("Error deleting innovation:", error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'draft':
        return 'status-badge draft';
      case 'submitted':
        return 'status-badge submitted';
      case 'approved':
        return 'status-badge approved';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="innovation-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Domain</th>
            <th>Level</th>
            <th>Status</th>
            <th>Submitted On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {innovations.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No innovations found</td>
            </tr>
          ) : (
            innovations.map(innovation => (
              <tr key={innovation.innovation_id}>
                <td>{innovation.title}</td>
                <td>{innovation.domain || 'N/A'}</td>
                <td>{innovation.level || 'N/A'}</td>
                <td>
                  <span className={getStatusBadgeClass(innovation.status)}>
                    {innovation.status ? innovation.status.charAt(0).toUpperCase() + innovation.status.slice(1) : 'N/A'}
                  </span>
                </td>
                <td>{innovation.submitted_on || 'Not Submitted'}</td>
                <td className="action-buttons">
                  <button 
                    // onClick={() => onSelect(innovation)} 
                    className="btn-view"
                  >
                    View/Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(innovation.innovation_id)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InnovationList;

