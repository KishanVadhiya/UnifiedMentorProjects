import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/styles/createJobOpening.css';

const CreateJobOpening = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(
        'http://localhost:4000/api/v1/jobopening',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSuccessMessage('Job opening created successfully!');
      setFormData({
        company: '',
        job_title: '',
        description: ''
      });
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job opening. Please try again.');
      console.error('Error creating job opening:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-job-page">
      <h1>Create Job Opening</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="job-form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="job_title">Job Title</label>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              required
              placeholder="Enter job title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter job description"
              rows="5"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Job Opening'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobOpening;