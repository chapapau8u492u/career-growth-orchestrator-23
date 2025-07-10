
const BACKEND_URL = 'https://job-hunter-backend-sigma.vercel.app';

export interface Resume {
  id?: string;
  userId?: string;
  title: string;
  template: string;
  personalInfo: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedIn?: string;
    linkedin?: string;
    summary?: string;
    profileImage?: string;
  };
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    location?: string;
  }>;
  experiences?: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution?: string;
    school?: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    graduationDate?: string;
    current?: boolean;
    gpa?: string;
    description?: string;
    location?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number | string;
    category?: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate?: string;
    url?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  languages?: Array<{
    id: string;
    name: string;
    proficiency: string;
  }>;
  accentColor?: string;
  status?: string;
  jobApplications?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to validate resume data
const validateResumeData = (resume: any): boolean => {
  if (!resume) return false;
  if (!resume.personalInfo) return false;
  if (!resume.personalInfo.firstName && !resume.personalInfo.fullName && !resume.title) return false;
  return true;
};

// Helper function to ensure proper ID format
const ensureProperResumeData = (resume: any): Resume => {
  return {
    ...resume,
    id: resume.id || resume._id?.toString() || `local_${Date.now()}`,
    title: resume.title || `${resume.personalInfo?.firstName || resume.personalInfo?.fullName || 'Untitled'} Resume`.trim(),
    personalInfo: resume.personalInfo || {},
    education: Array.isArray(resume.education) ? resume.education : [],
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    experience: resume.experience || resume.experiences || [],
    projects: resume.projects || [],
    certifications: resume.certifications || [],
    languages: resume.languages || []
  };
};

export const resumeApi = {
  // Get all resumes for a user
  getResumes: async (userId?: string): Promise<Resume[]> => {
    try {
      console.log('Fetching resumes from backend...');
      const url = userId ? `${BACKEND_URL}/api/resumes?userId=${userId}` : `${BACKEND_URL}/api/resumes`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched resumes from backend:', data.resumes?.length || 0);
      
      const validResumes = (data.resumes || [])
        .filter(validateResumeData)
        .map(ensureProperResumeData);
        
      // Sync with localStorage
      localStorage.setItem('resumes', JSON.stringify(validResumes));
      
      return validResumes;
    } catch (error) {
      console.error('Error fetching resumes from backend:', error);
      
      // Fallback to localStorage
      console.log('Falling back to localStorage...');
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        try {
          const parsed = JSON.parse(savedResumes);
          const validResumes = (Array.isArray(parsed) ? parsed : [])
            .filter(validateResumeData)
            .map(ensureProperResumeData);
          console.log('Loaded resumes from localStorage:', validResumes.length);
          return validResumes;
        } catch (parseError) {
          console.error('Error parsing saved resumes:', parseError);
          localStorage.removeItem('resumes'); // Clear corrupted data
        }
      }
      return [];
    }
  },

  // Get a single resume by ID
  getResumeById: async (id: string): Promise<Resume | null> => {
    console.log('Fetching resume by ID:', id);
    
    // First try to get from backend
    try {
      const response = await fetch(`${BACKEND_URL}/api/resumes/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && validateResumeData(data.data)) {
          return ensureProperResumeData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching resume from backend:', error);
    }
    
    // Fallback to localStorage
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      try {
        const parsed = JSON.parse(savedResumes);
        const resume = parsed.find((r: any) => r.id === id || r._id === id);
        if (resume && validateResumeData(resume)) {
          return ensureProperResumeData(resume);
        }
      } catch (error) {
        console.error('Error parsing localStorage resumes:', error);
      }
    }
    
    console.log('Resume not found:', id);
    return null;
  },

  // Create a new resume
  createResume: async (resumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume> => {
    console.log('Creating resume with data:', resumeData);
    
    // Validate required data
    if (!validateResumeData(resumeData)) {
      throw new Error('Invalid resume data: Missing required fields');
    }
    
    const newResumeData = ensureProperResumeData({
      ...resumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newResumeData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resume created successfully in backend:', data.data?.id);
        
        if (data.success && data.data && validateResumeData(data.data)) {
          const createdResume = ensureProperResumeData(data.data);
          
          // Update localStorage
          const savedResumes = localStorage.getItem('resumes');
          const resumes = savedResumes ? JSON.parse(savedResumes) : [];
          resumes.push(createdResume);
          localStorage.setItem('resumes', JSON.stringify(resumes));
          
          return createdResume;
        }
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error creating resume in backend:', error);
      
      // Fallback to localStorage with guaranteed valid ID
      console.log('Falling back to localStorage for resume creation...');
      const localResume: Resume = {
        ...newResumeData,
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      
      const savedResumes = localStorage.getItem('resumes');
      const resumes = savedResumes ? JSON.parse(savedResumes) : [];
      resumes.push(localResume);
      localStorage.setItem('resumes', JSON.stringify(resumes));
      console.log('Resume created in localStorage:', localResume.id);
      
      return localResume;
    }
  },

  // Update an existing resume
  updateResume: async (id: string, resumeData: Partial<Resume>): Promise<Resume> => {
    console.log('Updating resume:', id);
    
    const updateData = {
      ...resumeData,
      updatedAt: new Date().toISOString()
    };
    
    // Remove the id field from updateData to avoid conflicts
    delete updateData.id;

    try {
      const response = await fetch(`${BACKEND_URL}/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Resume updated successfully in backend');
        
        if (data.success && data.data && validateResumeData(data.data)) {
          const updatedResume = ensureProperResumeData(data.data);
          
          // Update localStorage
          const savedResumes = localStorage.getItem('resumes');
          if (savedResumes) {
            const resumes = JSON.parse(savedResumes);
            const index = resumes.findIndex((r: Resume) => r.id === id);
            if (index !== -1) {
              resumes[index] = updatedResume;
              localStorage.setItem('resumes', JSON.stringify(resumes));
            }
          }
          
          return updatedResume;
        }
      }
      
      throw new Error('Failed to update resume in backend');
    } catch (error) {
      console.error('Error updating resume in backend:', error);
      
      // Fallback to localStorage update
      console.log('Falling back to localStorage for resume update...');
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        const resumes = JSON.parse(savedResumes);
        const index = resumes.findIndex((r: Resume) => r.id === id);
        if (index !== -1) {
          const updatedResume = ensureProperResumeData({ 
            ...resumes[index], 
            ...updateData
          });
          resumes[index] = updatedResume;
          localStorage.setItem('resumes', JSON.stringify(resumes));
          console.log('Resume updated in localStorage');
          return updatedResume;
        }
      }
      throw new Error('Resume not found for update');
    }
  },

  // Delete a resume
  deleteResume: async (id: string): Promise<void> => {
    console.log('Deleting resume:', id);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/resumes/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Resume deleted successfully from backend');
      } else {
        console.warn('Failed to delete from backend, continuing with local deletion');
      }
    } catch (error) {
      console.error('Error deleting resume from backend:', error);
    }
    
    // Always remove from localStorage regardless of backend success
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      const resumes = JSON.parse(savedResumes);
      const filteredResumes = resumes.filter((r: Resume) => r.id !== id);
      localStorage.setItem('resumes', JSON.stringify(filteredResumes));
      console.log('Resume removed from localStorage');
    }
  },
};
