
import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { resumeApi } from '@/api/resumeApi';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  description?: string;
  status: 'Applied' | 'Interview Scheduled' | 'Under Review' | 'Rejected' | 'Offer';
  appliedDate: string;
  notes?: string;
  resumeUsed?: string;
  coverLetter?: string;
}

interface ApplicationFormProps {
  application?: JobApplication | null;
  onClose: () => void;
  onSubmit: (data: Partial<JobApplication>) => Promise<void>;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  application, 
  onClose, 
  onSubmit 
}) => {
  const isEditing = !!application;
  
  const [formData, setFormData] = useState({
    company: application?.company || '',
    position: application?.position || '',
    location: application?.location || '',
    salary: application?.salary || '',
    jobUrl: application?.jobUrl || '',
    description: application?.description || '',
    status: application?.status || 'Applied',
    appliedDate: application?.appliedDate || new Date().toISOString().split('T')[0],
    notes: application?.notes || '',
    resumeUsed: application?.resumeUsed || '',
    coverLetter: application?.coverLetter || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [availableResumes, setAvailableResumes] = useState<Array<{id: string, title: string}>>([]);

  useEffect(() => {
    loadAvailableResumes();
  }, []);

  const loadAvailableResumes = async () => {
    try {
      const resumes = await resumeApi.getResumes();
      const resumeList = resumes.map(resume => ({
        id: resume.id || '',
        title: resume.title || `${resume.personalInfo?.firstName || ''} ${resume.personalInfo?.lastName || ''} Resume`.trim() || 'Untitled Resume'
      }));
      setAvailableResumes(resumeList);
    } catch (error) {
      console.error('Error loading resumes:', error);
      // Fallback to localStorage
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        try {
          const parsed = JSON.parse(savedResumes);
          const resumeList = parsed.map((resume: any) => ({
            id: resume.id || '',
            title: resume.title || `${resume.personalInfo?.fullName || 'Untitled'} Resume`
          }));
          setAvailableResumes(resumeList);
        } catch (parseError) {
          console.error('Error parsing saved resumes:', parseError);
        }
      }
    }
  };

  const generateCoverLetter = async () => {
    if (!formData.company || !formData.position) {
      return;
    }

    setIsGeneratingCoverLetter(true);
    
    try {
      // Get the selected resume data
      let resumeData = null;
      if (formData.resumeUsed) {
        try {
          const resumes = await resumeApi.getResumes();
          resumeData = resumes.find(resume => 
            resume.id === formData.resumeUsed || 
            resume.title === formData.resumeUsed
          );
        } catch (error) {
          console.error('Error fetching resume data:', error);
        }
      }

      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      let coverLetterHeader = '';
      if (resumeData && resumeData.personalInfo) {
        const { firstName, lastName, email, phone, location } = resumeData.personalInfo;
        const fullName = `${firstName || ''} ${lastName || ''}`.trim();
        coverLetterHeader = `${fullName}
${location || ''}
${phone || ''}
${email || ''}

${currentDate}

Hiring Manager
${formData.company}

Dear Hiring Manager,

`;
      } else {
        coverLetterHeader = `${currentDate}

Hiring Manager
${formData.company}

Dear Hiring Manager,

`;
      }

      const systemPrompt = `You are an expert professional career coach and resume writer. Create a compelling cover letter body (do NOT include header information as it will be added separately). Focus on:

1. Strong opening that connects the candidate to the specific role
2. 1-2 paragraphs highlighting relevant experience and achievements from the resume
3. A paragraph showing understanding of the company/role and how the candidate adds value
4. Professional closing with call to action

Use specific details from the resume. Do not use any placeholder text. Be professional, confident, and tailored to the job description.`;

      const userPrompt = `Create a professional cover letter BODY ONLY (no header, no contact info, no date) for a ${formData.position} position at ${formData.company}.

${resumeData ? `RESUME DATA:
Name: ${resumeData.personalInfo?.firstName} ${resumeData.personalInfo?.lastName}
Email: ${resumeData.personalInfo?.email}
Summary: ${resumeData.personalInfo?.summary}

Work Experience:
${resumeData.experience?.map((exp: any) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
  ${exp.description}
`).join('') || 'N/A'}

Education:
${resumeData.education?.map((edu: any) => `- ${edu.degree} from ${edu.institution}`).join('\n') || 'N/A'}

Skills: ${resumeData.skills?.map((skill: any) => skill.name).join(', ') || 'N/A'}
` : ''}

JOB DESCRIPTION: ${formData.description || 'Standard job requirements for this position'}

Write ONLY the body paragraphs. Start directly with the opening paragraph. End with a professional closing paragraph and signature line. Do not include any header information, contact details, or date.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBmE7h85j2gCHUuqtkofhZcjtRYwN-8O78`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userPrompt
            }]
          }],
          systemInstruction: {
            parts: [{
              text: systemPrompt
            }]
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const generatedBody = data.candidates[0].content.parts[0].text.trim();
        const completeCoverLetter = coverLetterHeader + generatedBody;
        
        setFormData(prev => ({ ...prev, coverLetter: completeCoverLetter }));
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditing ? 'Edit Application' : 'Add New Application'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-sm font-semibold text-slate-700">
                Company *
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g., Google"
                className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-sm font-semibold text-slate-700">
                Position *
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer"
                className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-sm font-semibold text-slate-700">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <Label htmlFor="salary" className="text-sm font-semibold text-slate-700">
                Salary/Compensation
              </Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., $120,000 - $150,000"
                className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="jobUrl" className="text-sm font-semibold text-slate-700">
              Job URL
            </Label>
            <Input
              id="jobUrl"
              name="jobUrl"
              type="url"
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-sm font-semibold text-slate-700">
                Status
              </Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full h-11 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Applied">📝 Applied</option>
                <option value="Under Review">👀 Under Review</option>
                <option value="Interview Scheduled">📅 Interview Scheduled</option>
                <option value="Offer">🎉 Offer</option>
                <option value="Rejected">❌ Rejected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="appliedDate" className="text-sm font-semibold text-slate-700">
                Applied Date
              </Label>
              <Input
                id="appliedDate"
                name="appliedDate"
                type="date"
                value={formData.appliedDate}
                onChange={handleChange}
                className="mt-1 h-11 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="resumeUsed" className="text-sm font-semibold text-slate-700">
              Resume Used *
            </Label>
            <Select value={formData.resumeUsed} onValueChange={(value) => setFormData(prev => ({ ...prev, resumeUsed: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select the resume you used for this application" />
              </SelectTrigger>
              <SelectContent>
                {availableResumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.title}>
                    {resume.title}
                  </SelectItem>
                ))}
                {availableResumes.length === 0 && (
                  <SelectItem value="default" disabled>
                    No resumes found - Create a resume first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
              Job Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Job description, requirements, etc."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="coverLetter" className="text-sm font-semibold text-slate-700">
                Cover Letter
              </Label>
              <Button
                type="button"
                onClick={generateCoverLetter}
                disabled={isGeneratingCoverLetter || !formData.company || !formData.position || !formData.resumeUsed}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isGeneratingCoverLetter ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={6}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Your cover letter will appear here..."
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Any additional notes or thoughts about this application..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.company.trim() || !formData.position.trim() || !formData.resumeUsed}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update Application' : 'Add Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
