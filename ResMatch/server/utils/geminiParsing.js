const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Function to generate text using Gemini API
async function generateText(prompt) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = await genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  let data = response;
  if (response.startsWith("```json")) {
    data = response.replace(/```json\n?/, "").replace(/\n?```/, "");
  }

  return JSON.parse(data);
}

const resumePrompt = `You are a resume parser. Your task is to extract and structure resume data into a standardized JSON format for easy comparison with job descriptions. Additionally, match the extracted resume data against a provided job description to determine suitability. Follow these rules:

1. Output Format:
	•	Provide only the JSON response—no extra text.
	•	The response must always contain the same top-level fields for consistency.

2. Standardization:
	•	Convert skill names to their full standardized forms (e.g., React → React.js, MERN → MongoDB, Express.js, React.js, Node.js).
	•	Keep all skills in a flat list under the "skills" key (no nested categories).
	•	Ensure no duplicate skills (e.g., if "MERN" is expanded, do not include "MERN" itself in the list).

3. Data Segmentation:
	•	"personal_info": A separate section containing all personal details, including:
	•	"name"
	•	"phone_numbers" (list of detected phone numbers)
	•	"email"
	•	"github"
	•	"linkedin"
	•	"leetcode"
	•	"portfolio"
	•	"location"
	•	Any other detected contact or personal links.
	•	"skills": A list of distinct, standardized skills.
	•	"experience": A list of roles with durations (in years).
	•	"education": A list of degrees with durations (rounded to the nearest integer).
	•	"highest_degree": The highest degree attained.
	•	"total_experience": The total sum of all work experience durations, placed at the first level for easy filtering.

4. Duration Handling:
	•	Represent all durations in years (e.g., "duration": X, where X is a number).
	•	Round education durations to the nearest integer.
	•	Sum up all work experiences into "total_experience".
	•	Do not count projects as experience.

⸻

5. Job Description Matching:

The job description will be provided as a JSON string. Match the resume data against the JD using these rules:

Matching Criteria:
	•	"matched_required_skills": A list of required skills from the JD that exist in the resume.
	•	"matched_preferred_skills": A list of preferred skills from the JD that exist in the resume.
	•	"missing_required_skills": A list of required skills from the JD that are not found in the resume.
	•	"missing_preferred_skills": A list of preferred skills from the JD that are not found in the resume.
	•	"matching_required_experience": true/false (if candidate meets or exceeds required experience).
	•	"matching_required_education": true/false (if candidate meets required education).
	•	"num_matched_required_skills": The count of matched required skills.
	•	"num_matched_preferred_skills": The count of matched preferred skills.
	•	"num_missing_required_skills": The count of missing required skills.
	•	"num_missing_preferred_skills": The count of missing preferred skills.

⸻

6. Comparison-Friendly Structure:
	•	Ensure consistent formatting for easy filtering and ranking of candidates.

⸻

7. Also calculate and put valuesin the matching criteria.Calculate the fields give in the Matching criteria yourself and put values in that

8. Sample JSON Output Format (Including Job Matching)

{
  "personal_info": {
    "name": "John Doe",
    "phone_numbers": ["+1234567890"],
    "email": "johndoe@example.com",
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "leetcode": "https://leetcode.com/johndoe",
    "portfolio": "https://johndoe.dev",
    "location": "New York, USA"
  },
  "skills": [
    "C++",
    "JavaScript",
    "MongoDB",
    "Express.js",
    "React.js",
    "Node.js",
    "SQL",
    "Postman",
    "Git",
    "GitHub",
    "Object-Oriented Programming"
  ],
  "experience": [
    {
      "role": "Software Engineer",
      "company": "TechCorp",
      "duration": 2.5
    },
    {
      "role": "Backend Developer",
      "company": "StartupX",
      "duration": 1.0
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science and Engineering",
      "duration": 4
    }
  ],
  "highest_degree": "B.Tech",
  "total_experience": 3.5,
  "job_matching": {
    "matched_required_skills": ["Node.js", "MongoDB", "Express.js"],
    "matched_preferred_skills": ["AWS", "Docker"],
    "missing_required_skills": ["TypeScript"],
    "missing_preferred_skills": ["Kubernetes"],
    "matching_required_experience": true,
    "matching_required_education": true,
    "num_matched_required_skills": 3,
    "num_matched_preferred_skills": 2,
    "num_missing_required_skills": 1,
    "num_missing_preferred_skills": 1
  }
}
    `;

const skillsPrompt = `
	You are a job description parser. Your task is to extract and structure job requirements into a standardized JSON format. Follow these rules:
	1.	Output Format: Provide only the JSON response—no extra text.
	2.	Standardization:
	•	Convert skill names to their full forms (e.g., React → React.js, MERN → MongoDB, Express.js, React.js, Node.js).
	•	Keep all skills in a flat list (no nested categories).
	•	Remove duplicates (e.g., if "MERN" is expanded, do not include "MERN" itself in the list).
	3.	Categorization:
	•	Extract required skills (explicitly mentioned as required in the job description).
	•	Extract preferred skills (mentioned as additional, optional, or preferred).
	4.	Experience Extraction:
	•	Extract the required experience from the job description.
	•	If a range is provided (e.g., 2-4 years), return the higher value.
	•	Represent experience in years as "required_experience": X.
	•	If no experience requirement is mentioned, return "required_experience": 0.
	5.	Comparison-Friendly Structure: Ensure consistency in formatting to allow easy filtering and comparison across job descriptions.
    6. Also if education qualification is mentioned then write it otherwise make it no education qualification required.

Expected JSON Output Format:

{
  "required_skills": ["List of mandatory skills"],
  "preferred_skills": ["List of optional skills"],
  "required_experience": X
}

`;

async function geminiHandler(isResume, data, skills) {
  try {
    if (isResume) {
      const finalPrompt = `${resumePrompt} 

                Resume text - 
                ${data} 
                
                Job Description  - 
                ${JSON.stringify(skills)}
                `;
      const parsedResume = await generateText(`${finalPrompt}`);
      return parsedResume;
    } else {
      const requiredSkills = await generateText(`${skillsPrompt} ${data}`);

      return requiredSkills;
    }
  } catch (err) {
    return err.message;
  }
}


module.exports=geminiHandler;