import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/layout/Loader';
import '../../assets/styles/resume.css';

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId, resumeId } = useParams();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`http://localhost:4000/api/v1/resumes/${jobId}/${resumeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.status}`);
        }

        const data = await response.json();
        setResume(data[0]); // Get the first item from the array
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResume();
    }
  }, [jobId, resumeId, isAuthenticated]);

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="resume-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="resume-error">
        <h2>Resume Not Found</h2>
      </div>
    );
  }

  const { name, email, resume_url, parsed_data, submitted_at } = resume;
  const { personal_info, skills, experience, education, job_matching } = parsed_data;

  return (
    <div className="resume-page">
      <h1>Resume Details</h1>
      
      <div className="resume-container">
        <div className="resume-header">
          <div className="candidate-info">
            <h2>{name}</h2>
            <p>{email}</p>
            <p>Submitted: {new Date(submitted_at).toLocaleDateString()}</p>
          </div>
          <div className="resume-actions">
            <a href={resume_url} className="btn" target="_blank" rel="noopener noreferrer">
              View Original Resume
            </a>
          </div>
        </div>

        <div className="resume-grid">
          <div className="resume-section personal-info">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{personal_info.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{personal_info.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{personal_info.phone_numbers?.join(', ') || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Location:</label>
                <span>{personal_info.location || 'N/A'}</span>
              </div>
              {personal_info.linkedin && (
                <div className="info-item">
                  <label>LinkedIn:</label>
                  <a href={`https://${personal_info.linkedin}`} target="_blank" rel="noopener noreferrer">
                    {personal_info.linkedin}
                  </a>
                </div>
              )}
              {personal_info.github && (
                <div className="info-item">
                  <label>GitHub:</label>
                  <a href={`https://${personal_info.github}`} target="_blank" rel="noopener noreferrer">
                    {personal_info.github}
                  </a>
                </div>
              )}
              {personal_info.portfolio && (
                <div className="info-item">
                  <label>Portfolio:</label>
                  <a href={personal_info.portfolio} target="_blank" rel="noopener noreferrer">
                    {personal_info.portfolio}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="resume-section skills">
            <h3>Skills</h3>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="resume-section experience">
            <h3>Experience</h3>
            {experience.length > 0 ? (
              <div className="experience-list">
                {experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <h4>{exp.role}</h4>
                    <p className="company">{exp.company}</p>
                    <p className="duration">{exp.duration} {exp.duration === 1 ? 'year' : 'years'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No experience listed</p>
            )}
            <div className="info-item">
              <label>Total Experience:</label>
              <span>{parsed_data.total_experience} {parsed_data.total_experience === 1 ? 'year' : 'years'}</span>
            </div>
          </div>

          <div className="resume-section education">
            <h3>Education</h3>
            {education.length > 0 ? (
              <div className="education-list">
                {education.map((edu, index) => (
                  <div key={index} className="education-item">
                    <h4>{edu.degree}</h4>
                    <p className="duration">{edu.duration} {edu.duration === 1 ? 'year' : 'years'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No education listed</p>
            )}
            <div className="info-item">
              <label>Highest Degree:</label>
              <span>{parsed_data.highest_degree}</span>
            </div>
          </div>

          <div className="resume-section job-matching">
            <h3>Job Matching</h3>
            <div className="matching-summary">
              <div className={`matching-score ${getMatchingClass(job_matching)}`}>
                <span className="score-label">Match Score</span>
                <span className="score-value">{calculateMatchScore(job_matching)}%</span>
              </div>
              
              <div className="matching-details">
                <h4>Required Skills</h4>
                <div className="skills-match">
                  <div className="match-item">
                    <span className="match-label">Matched:</span>
                    <span className="match-count">{job_matching.num_matched_required_skills}</span>
                  </div>
                  <div className="match-item">
                    <span className="match-label">Missing:</span>
                    <span className="match-count">{job_matching.num_missing_required_skills}</span>
                  </div>
                </div>
                
                <h4>Preferred Skills</h4>
                <div className="skills-match">
                  <div className="match-item">
                    <span className="match-label">Matched:</span>
                    <span className="match-count">{job_matching.num_matched_preferred_skills}</span>
                  </div>
                  <div className="match-item">
                    <span className="match-label">Missing:</span>
                    <span className="match-count">{job_matching.num_missing_preferred_skills}</span>
                  </div>
                </div>
                
                <div className="qualification-match">
                  <div className="match-item">
                    <span className="match-label">Experience:</span>
                    <span className={`match-status ${job_matching.matching_required_experience ? 'match' : 'no-match'}`}>
                      {job_matching.matching_required_experience ? 'Meets Requirement' : 'Does Not Meet'}
                    </span>
                  </div>
                  <div className="match-item">
                    <span className="match-label">Education:</span>
                    <span className={`match-status ${job_matching.matching_required_education ? 'match' : 'no-match'}`}>
                      {job_matching.matching_required_education ? 'Meets Requirement' : 'Does Not Meet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="matched-skills-section">
              <h4>Matched Required Skills</h4>
              <div className="skills-list">
                {job_matching.matched_required_skills.map((skill, index) => (
                  <span key={index} className="skill-tag match">{skill}</span>
                ))}
                {job_matching.matched_required_skills.length === 0 && <p>None</p>}
              </div>
              
              <h4>Matched Preferred Skills</h4>
              <div className="skills-list">
                {job_matching.matched_preferred_skills.map((skill, index) => (
                  <span key={index} className="skill-tag match">{skill}</span>
                ))}
                {job_matching.matched_preferred_skills.length === 0 && <p>None</p>}
              </div>
              
              <h4>Missing Required Skills</h4>
              <div className="skills-list">
                {job_matching.missing_required_skills.map((skill, index) => (
                  <span key={index} className="skill-tag missing">{skill}</span>
                ))}
                {job_matching.missing_required_skills.length === 0 && <p>None</p>}
              </div>
              
              <h4>Missing Preferred Skills</h4>
              <div className="skills-list">
                {job_matching.missing_preferred_skills.map((skill, index) => (
                  <span key={index} className="skill-tag missing">{skill}</span>
                ))}
                {job_matching.missing_preferred_skills.length === 0 && <p>None</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function calculateMatchScore(jobMatching) {
  const totalRequired = jobMatching.num_matched_required_skills + jobMatching.num_missing_required_skills;
  const totalPreferred = jobMatching.num_matched_preferred_skills + jobMatching.num_missing_preferred_skills;
  
  let score = 0;
  let totalPoints = 0;
  
  // Required skills are weighted more heavily
  if (totalRequired > 0) {
    score += (jobMatching.num_matched_required_skills / totalRequired) * 70;
    totalPoints += 70;
  }
  
  // Preferred skills
  if (totalPreferred > 0) {
    score += (jobMatching.num_matched_preferred_skills / totalPreferred) * 20;
    totalPoints += 20;
  }
  
  // Experience and education requirements
  if (jobMatching.matching_required_experience) score += 5;
  if (jobMatching.matching_required_education) score += 5;
  totalPoints += 10;
  
  // Calculate percentage
  return Math.round((score / totalPoints) * 100);
}

function getMatchingClass(jobMatching) {
  const score = calculateMatchScore(jobMatching);
  
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'average';
  return 'poor';
}

export default Resume;