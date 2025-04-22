import React, { useState } from 'react';
import { createInnovation, updateInnovation } from '../api/innovationService';
import '../styles/InnovationForm.css'; // Assuming you have some CSS for styling

const InnovationForm = ({ innovation, onSubmit, onCancel }) => {
  const isEditing = !!innovation;
  
  const [formData, setFormData] = useState({
    title: innovation?.title || '',
    description: innovation?.description || '',
    domain: innovation?.domain || '',
    level: innovation?.level || '',
    status: innovation?.status || 'draft'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      if (isEditing) {
        await updateInnovation(innovation.innovation_id, formData);
      } else {
        await createInnovation(formData);
      }
      onSubmit(); // Changed from onClose to onSubmit to match parent component
    } catch (error) {
      console.error("Error saving innovation:", error);
      setErrors({ submit: 'Failed to save innovation. Please try again.' });
    }
  };
  
  return (
    <div className="innovation-form">
      {/* Form header removed from here - now handled by parent modal */}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="domain">Domain</label>
            <select
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
            >
              <option value="">Select Domain</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Environment">Environment</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="">Select Level</option>
              <option value="institute">Institute</option>
              <option value="state">State</option>
              <option value="national">National</option>
            </select>
          </div>
        </div>
        
        {isEditing && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        )}
        
        {errors.submit && <div className="error-message global">{errors.submit}</div>}
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
};

export default InnovationForm;