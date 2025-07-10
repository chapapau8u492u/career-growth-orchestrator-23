import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { resumeApi, Resume } from '@/api/resumeApi';
import { ArrowLeft, Save, Plus, Trash2, Eye } from 'lucide-react';

const EditResume = () => {
  const { id = 'new' } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    setIsLoading(true);
    try {
      if (id === 'new') {
        // Get template and name from URL params
        const templateId = searchParams.get('template') || '1';
        const resumeName = searchParams.get('name') || 'New Resume';
        
        // Create a new resume template
        const newResume: Resume = {
          title: resumeName,
          template: getTemplateName(templateId),
          personalInfo: {
            firstName: '',
            lastName: '',
            fullName: '',
            email: '',
            phone: '',
            location: '',
            summary: ''
          },
          experiences: [],
          education: [],
          skills: [],
          projects: [],
          accentColor: '#3B82F6',
          status: 'draft',
          jobApplications: 0
        };
        setResume(newResume);
      } else {
        // Load existing resume
        const existingResume = await resumeApi.getResumeById(id);
        if (existingResume) {
          setResume(existingResume);
        } else {
          toast({
            title: "Resume Not Found",
            description: "The resume you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate('/resume');
          return;
        }
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error Loading Resume",
        description: "Failed to load resume data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateName = (templateId: string) => {
    const templates = {
      '1': 'professional',
      '2': 'modern',
      '3': 'minimal',
      '4': 'creative'
    };
    return templates[templateId as keyof typeof templates] || 'modern';
  };

  const saveResume = async () => {
    if (!resume) return;

    // Validation
    if (!resume.personalInfo?.firstName && !resume.personalInfo?.fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      let savedResume: Resume;
      
      if (id === 'new') {
        // Create new resume
        savedResume = await resumeApi.createResume(resume);
        toast({
          title: "Resume Created",
          description: "Your resume has been created successfully.",
        });
        
        // Navigate to the edit page with the new ID
        // navigate(`/resume/edit/${savedResume.id}`, { replace: true });
      } else {
        // Update existing resume
        savedResume = await resumeApi.updateResume(id, resume);
        toast({
          title: "Resume Saved",
          description: "Your changes have been saved successfully.",
        });
      }
      
      setResume(savedResume);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  const addExperience = () => {
    if (!resume) return;
    const newExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    setResume({
      ...resume,
      experiences: [...(resume.experiences || []), newExperience]
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    if (!resume) return;
    const updatedExperiences = [...(resume.experiences || [])];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    setResume({
      ...resume,
      experiences: updatedExperiences
    });
  };

  const removeExperience = (index: number) => {
    if (!resume) return;
    const updatedExperiences = resume.experiences?.filter((_, i) => i !== index) || [];
    setResume({
      ...resume,
      experiences: updatedExperiences
    });
  };

  const addEducation = () => {
    if (!resume) return;
    const newEducation = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    
    setResume({
      ...resume,
      education: [...resume.education, newEducation]
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    if (!resume) return;
    const updatedEducation = [...resume.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setResume({
      ...resume,
      education: updatedEducation
    });
  };

  const removeEducation = (index: number) => {
    if (!resume) return;
    const updatedEducation = resume.education.filter((_, i) => i !== index);
    setResume({
      ...resume,
      education: updatedEducation
    });
  };

  const addSkill = () => {
    if (!resume) return;
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 'intermediate'
    };
    
    setResume({
      ...resume,
      skills: [...resume.skills, newSkill]
    });
  };

  const updateSkill = (index: number, field: string, value: string) => {
    if (!resume) return;
    const updatedSkills = [...resume.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    
    setResume({
      ...resume,
      skills: updatedSkills
    });
  };

  const removeSkill = (index: number) => {
    if (!resume) return;
    const updatedSkills = resume.skills.filter((_, i) => i !== index);
    setResume({
      ...resume,
      skills: updatedSkills
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Resume not found</p>
        <Button onClick={() => navigate('/resume')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resumes
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/resume')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resumes
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id === 'new' ? 'Create Resume' : 'Edit Resume'}
            </h1>
            <p className="text-gray-600">{resume.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/resume/preview/${resume.id || 'preview'}`)}
            disabled={id === 'new'}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            onClick={saveResume}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Resume'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={resume.personalInfo?.firstName || ''}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={resume.personalInfo?.lastName || ''}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resume.personalInfo?.email || ''}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resume.personalInfo?.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resume.personalInfo?.location || ''}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={resume.personalInfo?.summary || ''}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="Write a brief professional summary..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button onClick={addExperience} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {resume.experiences?.map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                      />
                      <Label htmlFor={`current-${index}`}>Currently working here</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      rows={4}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}
              
              {(!resume.experiences || resume.experiences.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No work experience added yet</p>
                  <Button onClick={addExperience} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Experience
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button onClick={addEducation} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {resume.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>School/University</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {resume.education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No education added yet</p>
                  <Button onClick={addEducation} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your Education
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button onClick={addSkill} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resume.skills.map((skill, index) => (
                  <div key={skill.id} className="flex items-center gap-2 p-3 border rounded-lg">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', e.target.value)}
                      className="px-3 py-2 border rounded-md bg-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {resume.skills.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No skills added yet</p>
                  <Button onClick={addSkill} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Skill
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditResume;
