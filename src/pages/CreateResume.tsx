import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Sparkles, Zap, ArrowRight, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumePreviewPanel from "@/components/ResumePreviewPanel";
import TemplateSelector from "@/components/TemplateSelector";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";
import { resumeApi, Resume } from '@/api/resumeApi';


interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
  profileImage?: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const CreateResume = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingExperience, setIsGeneratingExperience] = useState(false);
  const [isGeneratingAIResume, setIsGeneratingAIResume] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiSummary, setAISummary] = useState('');
  const [resumeName, setResumeName] = useState('');
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    summary: '',
    profileImage: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([{
    id: '1',
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  const [education, setEducation] = useState<Education[]>([{
    id: '1',
    degree: '',
    school: '',
    location: '',
    graduationDate: '',
    gpa: ''
  }]);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const templateRequiresPhoto = (templateId: string) => {
    const photoTemplates = ['professional', 'creative', 'sidebar', 'elegant', 'student', 'minimal'];
    return photoTemplates.includes(templateId);
  };

  const generateAIResumeFromSummary = async () => {
    if (!aiSummary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a brief summary about yourself to generate a resume.",
        variant: "destructive"
      });
      return;
    }

    if (!resumeName.trim()) {
      toast({
        title: "Resume Name Required",
        description: "Please provide a name for your resume (e.g., SDE Resume, Frontend Developer).",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAIResume(true);
    
    try {
      const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/ai/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          summary: aiSummary.trim(),
          resumeName: resumeName.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.resume) {
          setPersonalInfo({
            fullName: data.resume.personalInfo.fullName || '',
            email: data.resume.personalInfo.email || '',
            phone: data.resume.personalInfo.phone || '',
            location: data.resume.personalInfo.location || '',
            linkedIn: '',
            website: '',
            summary: data.resume.personalInfo.summary || '',
            profileImage: ''
          });
          
          setExperiences(data.resume.experiences || []);
          setEducation(data.resume.education || []);
          setSkills(data.resume.skills || []);
          
          setShowAIGenerator(false);
          toast({
            title: "AI Resume Generated!",
            description: "Your resume has been populated with AI-generated content. You can now edit it further.",
          });
        }
      } else {
        throw new Error('Failed to generate resume');
      }
    } catch (error) {
      console.error('Error generating AI resume:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate resume. Please try again or create manually.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAIResume(false);
    }
  };

  const fillDemoData = async() => {
    const demoImage = "data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em' fill='%236b7280'%3EJS%3C/text%3E%3C/svg%3E";
    
    setPersonalInfo({
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/johnsmith',
      website: 'https://johnsmith.dev',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams to achieve business objectives.',
      profileImage: demoImage
    });

    setExperiences([{
      id: '1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: '• Led development of microservices architecture serving 1M+ users\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews\n• Collaborated with product team to define technical requirements'
    }, {
      id: '2',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: '• Built responsive web applications using React and Node.js\n• Designed and implemented RESTful APIs with 99.9% uptime\n• Optimized database queries improving performance by 40%\n• Worked in agile environment with 2-week sprint cycles'
    }]);

    setEducation([{
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: '2020-05',
      gpa: '3.8'
    }]);

    setSkills([
      { id: '1', name: 'JavaScript', level: 'expert' },
      { id: '2', name: 'React', level: 'expert' },
      { id: '3', name: 'Node.js', level: 'advanced' },
      { id: '4', name: 'Python', level: 'advanced' },
      { id: '5', name: 'AWS', level: 'intermediate' },
      { id: '6', name: 'Docker', level: 'intermediate' }
    ]);

    toast({
      title: "Demo Data Filled!",
      description: "All fields have been populated with sample data.",
    });
  };

  const generateAISummary = async () => {
    if (!personalInfo.fullName || experiences[0]?.jobTitle === '') {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and at least one job title to generate a summary.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSummary(true);
    
    try {
      const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          jobTitle: experiences[0]?.jobTitle || 'Professional'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.summary) {
          setPersonalInfo(prev => ({ ...prev, summary: data.summary }));
          toast({
            title: "Summary Generated!",
            description: "Your AI-powered professional summary has been created.",
          });
        }
      } else {
        throw new Error('Failed to generate summary');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateExperienceDescription = async (experienceId: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (!experience?.jobTitle || !experience?.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title and company name first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingExperience(true);
    
    try {
      const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/ai/generate-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: experience.jobTitle,
          company: experience.company
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.description) {
          setExperiences(prev => prev.map(exp => 
            exp.id === experienceId 
              ? { ...exp, description: data.description }
              : exp
          ));
          toast({
            title: "Description Generated!",
            description: "Your AI-powered job description has been created.",
          });
        }
      } else {
        throw new Error('Failed to generate description');
      }
    } catch (error) {
      console.error('Error generating experience description:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingExperience(false);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        level: 'intermediate'
      };
      setSkills([...skills, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const createResume = async() => {
    if (!personalInfo.fullName || !personalInfo.email) {
      toast({
        title: "Missing Required Information",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      });
      return;
    }

    const resumeId = Date.now().toString();
    const resumeData = {
      id: resumeId,
      title: resumeName.trim() || `${personalInfo.fullName} Resume`,
      personalInfo,
      experiences,
      education,
      skills,
      template: selectedTemplate,
      accentColor: selectedColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      jobApplications: 0
    };

    const existingResumes = localStorage.getItem('resumes');
    const resumes = existingResumes ? JSON.parse(existingResumes) : [];
    resumes.push(resumeData);
    localStorage.setItem('resumes', JSON.stringify(resumes));

    let SavedResume = await resumeApi.createResume(resumeData);

    toast({
      title: "Resume Created!",
      description: "Your resume has been successfully created.",
    });

    // navigate(`/edit-resume/${resumeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-1/2 border-r bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Create New Resume</h1>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => setShowAIGenerator(!showAIGenerator)} 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
                >
                  <Wand2 className="mr-2 h-4 w-4 text-purple-600" />
                  AI Generate
                </Button>
                <Button onClick={fillDemoData} variant="outline" size="sm" className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Fill Demo Data
                </Button>
                <Button onClick={createResume} size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Create Resume
                </Button>
              </div>
            </div>

            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Wand2 className="mr-2 h-5 w-5" />
                  AI Resume Generator
                </CardTitle>
                <CardDescription>
                  Provide a brief summary and let AI create your entire resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Resume Name *</label>
                  <Input
                    placeholder="e.g., SDE Resume, Frontend Developer, Backend Engineer"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">About Yourself *</label>
                  <Textarea
                    placeholder="Example: I am John Smith, a software engineer with 3 years of experience in React and Node.js. I have worked at tech startups and enjoy building scalable web applications..."
                    value={aiSummary}
                    onChange={(e) => setAISummary(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={generateAIResumeFromSummary}
                  disabled={isGeneratingAIResume || !aiSummary.trim() || !resumeName.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGeneratingAIResume ? 'Generating Resume...' : 'Generate Complete Resume'}
                </Button>
              </CardContent>
            </Card>

            <TemplateSelector
              selectedTemplate={selectedTemplate}
              selectedColor={selectedColor}
              onTemplateChange={setSelectedTemplate}
              onColorChange={setSelectedColor}
            />

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Your contact details and basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Full Name *"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                  <Input
                    placeholder="Email Address *"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                  />
                  <Input
                    placeholder="LinkedIn Profile"
                    value={personalInfo.linkedIn}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, linkedIn: e.target.value }))}
                  />
                  <Input
                    placeholder="Website/Portfolio"
                    value={personalInfo.website}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                
                {templateRequiresPhoto(selectedTemplate) && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium mb-3 block">Profile Photo</label>
                      <ProfilePhotoUpload
                        currentImage={personalInfo.profileImage}
                        onImageChange={(imageUrl) => setPersonalInfo(prev => ({ ...prev, profileImage: imageUrl || '' }))}
                      />
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Professional Summary</label>
                    <Button
                      onClick={generateAISummary}
                      disabled={isGeneratingSummary}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Sparkles className="mr-2 h-3 w-3" />
                      {isGeneratingSummary ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="A brief professional summary highlighting your key strengths and career objectives..."
                    value={personalInfo.summary}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, summary: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Work Experience</CardTitle>
                    <CardDescription>Your professional work history</CardDescription>
                  </div>
                  <Button onClick={addExperience} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Experience #{index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => generateExperienceDescription(exp.id)}
                          disabled={isGeneratingExperience}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          {isGeneratingExperience ? 'AI...' : 'AI'}
                        </Button>
                        {experiences.length > 1 && (
                          <Button
                            onClick={() => removeExperience(exp.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) => setExperiences(prev => prev.map(item => 
                          item.id === exp.id ? { ...item, jobTitle: e.target.value } : item
                        ))}
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => setExperiences(prev => prev.map(item => 
                          item.id === exp.id ? { ...item, company: e.target.value } : item
                        ))}
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => setExperiences(prev => prev.map(item => 
                          item.id === exp.id ? { ...item, location: e.target.value } : item
                        ))}
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Start Date"
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => setExperiences(prev => prev.map(item => 
                            item.id === exp.id ? { ...item, startDate: e.target.value } : item
                          ))}
                        />
                        {!exp.current && (
                          <Input
                            placeholder="End Date"
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => setExperiences(prev => prev.map(item => 
                              item.id === exp.id ? { ...item, endDate: e.target.value } : item
                            ))}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => setExperiences(prev => prev.map(item => 
                            item.id === exp.id ? { ...item, current: e.target.checked, endDate: e.target.checked ? '' : item.endDate } : item
                          ))}
                        />
                        <span>I currently work here</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job Description</label>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => setExperiences(prev => prev.map(item => 
                          item.id === exp.id ? { ...item, description: e.target.value } : item
                        ))}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Education</CardTitle>
                    <CardDescription>Your educational background</CardDescription>
                  </div>
                  <Button onClick={addEducation} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu, index) => (
                  <div key={edu.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Education #{index + 1}</h4>
                      {education.length > 1 && (
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => setEducation(prev => prev.map(item => 
                          item.id === edu.id ? { ...item, degree: e.target.value } : item
                        ))}
                      />
                      <Input
                        placeholder="School/University"
                        value={edu.school}
                        onChange={(e) => setEducation(prev => prev.map(item => 
                          item.id === edu.id ? { ...item, school: e.target.value } : item
                        ))}
                      />
                      <Input
                        placeholder="Location"
                        value={edu.location}
                        onChange={(e) => setEducation(prev => prev.map(item => 
                          item.id === edu.id ? { ...item, location: e.target.value } : item
                        ))}
                      />
                      <Input
                        placeholder="Graduation Date"
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) => setEducation(prev => prev.map(item => 
                          item.id === edu.id ? { ...item, graduationDate: e.target.value } : item
                        ))}
                      />
                    </div>
                    <Input
                      placeholder="GPA (optional)"
                      value={edu.gpa}
                      onChange={(e) => setEducation(prev => prev.map(item => 
                        item.id === edu.id ? { ...item, gpa: e.target.value } : item
                      ))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Skills</CardTitle>
                <CardDescription>Your technical and professional skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1">
                      {skill.name}
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-1/2 bg-gray-100">
          <ResumePreviewPanel
            personalInfo={personalInfo}
            experiences={experiences}
            education={education}
            skills={skills}
            template={selectedTemplate as any}
            accentColor={selectedColor}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateResume;
