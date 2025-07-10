import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Building, MapPin, ExternalLink, Edit, Trash2, Sparkles, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  jobUrl: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedDate: string;
  lastUpdate: string;
  resumeUsed: string;
  coverLetter: string;
  notes: string;
  interviewDate?: string;
  salary?: string;
  jobDescription: string;
}

const BACKEND_URL = 'https://job-hunter-backend-sigma.vercel.app';

const JobTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [newApplication, setNewApplication] = useState<Partial<JobApplication>>({
    company: '',
    position: '',
    location: '',
    jobUrl: '',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    resumeUsed: '',
    coverLetter: '',
    notes: '',
    salary: '',
    jobDescription: ''
  });
  const [availableResumes, setAvailableResumes] = useState<Array<{id: string, title: string}>>([]);

  useEffect(() => {
    loadApplications();
    // setupWebSocket();
    loadAvailableResumes();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/applications`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        // Fallback to localStorage if backend is unavailable
        const savedApplications = localStorage.getItem('jobApplications');
        if (savedApplications) {
          try {
            const parsed = JSON.parse(savedApplications);
            setApplications(Array.isArray(parsed) ? parsed : []);
          } catch (error) {
            console.error('Error loading from localStorage:', error);
            setApplications([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      // Fallback to localStorage
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        try {
          const parsed = JSON.parse(savedApplications);
          setApplications(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Error loading from localStorage:', error);
          setApplications([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const setupWebSocket = () => {
  //   try {
  //     const websocket = new WebSocket(`wss://job-hunter-backend-sigma.vercel.app/`);
      
  //     websocket.onopen = () => {
  //       console.log('Job Tracker WebSocket connected');
  //     };
      
  //     websocket.onmessage = (event) => {
  //       try {
  //         const data = JSON.parse(event.data);
          
  //         switch (data.type) {
  //           case 'INITIAL_DATA':
  //             setApplications(data.applications || []);
  //             break;
  //           case 'NEW_APPLICATION':
  //             setApplications(prev => {
  //               const exists = prev.some(app => app.id === data.application.id);
  //               if (exists) return prev;
  //               return [data.application, ...prev];
  //             });
  //             break;
  //           case 'APPLICATION_UPDATED':
  //             setApplications(prev => 
  //               prev.map(app => 
  //                 app.id === data.application.id ? data.application : app
  //               )
  //             );
  //             break;
  //         }
  //       } catch (error) {
  //         console.error('Error parsing WebSocket message:', error);
  //       }
  //     };
      
  //     websocket.onclose = () => {
  //       console.log('Job Tracker WebSocket disconnected');
  //       setTimeout(setupWebSocket, 5000);
  //     };
      
  //   } catch (error) {
  //     console.error('Error setting up WebSocket:', error);
  //   }
  // };

  const loadAvailableResumes = () => {
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      const resumes = JSON.parse(savedResumes);
      setAvailableResumes(resumes.map((resume: any) => ({
        id: resume.id,
        title: resume.title || `${resume.personalInfo?.fullName || 'Untitled'} Resume`
      })));
    }
  };

  const saveApplications = async (apps: JobApplication[]) => {
    setApplications(apps);
    localStorage.setItem('jobApplications', JSON.stringify(apps));
    
    // Try to sync with backend
    try {
      await fetch(`${BACKEND_URL}/api/applications/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applications: apps })
      });
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  };

  const addApplication = async () => {
    if (!newApplication.company || !newApplication.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in company and position fields.",
        variant: "destructive"
      });
      return;
    }

    const application: JobApplication = {
      id: Date.now().toString(),
      company: newApplication.company!,
      position: newApplication.position!,
      location: newApplication.location || '',
      jobUrl: newApplication.jobUrl || '',
      status: newApplication.status as JobApplication['status'] || 'applied',
      appliedDate: newApplication.appliedDate || new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0],
      resumeUsed: newApplication.resumeUsed || '',
      coverLetter: newApplication.coverLetter || '',
      notes: newApplication.notes || '',
      salary: newApplication.salary || '',
      jobDescription: newApplication.jobDescription || ''
    };

    // Try to save to backend first
    try {
      const response = await fetch(`${BACKEND_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Application saved to backend:', result);
      }
    } catch (error) {
      console.error('Failed to save to backend:', error);
    }

    const updatedApplications = [...applications, application];
    await saveApplications(updatedApplications);

    toast({
      title: "Application Added!",
      description: "Your job application has been successfully tracked.",
    });

    setIsAddingNew(false);
    setNewApplication({
      company: '',
      position: '',
      location: '',
      jobUrl: '',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      resumeUsed: '',
      coverLetter: '',
      notes: '',
      salary: '',
      jobDescription: ''
    });
  };

  const updateApplication = async (updatedApp: JobApplication) => {
    const updatedApplications = applications.map(app => 
      app.id === updatedApp.id 
        ? { ...updatedApp, lastUpdate: new Date().toISOString().split('T')[0] }
        : app
    );
    await saveApplications(updatedApplications);
    setEditingApp(null);
    
    toast({
      title: "Application Updated!",
      description: "Your job application has been successfully updated.",
    });
  };

  const deleteApplication = async (id: string) => {
    const updatedApplications = applications.filter(app => app.id !== id);
    await saveApplications(updatedApplications);
    
    toast({
      title: "Application Deleted",
      description: "The job application has been removed from your tracker.",
    });
  };

  const generateCoverLetter = async (application: Partial<JobApplication>) => {
    if (!application.company || !application.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in company and position to generate a cover letter.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingCoverLetter(true);
    
    try {
      // Get the selected resume data
      let resumeData = null;
      if (application.resumeUsed && availableResumes.length > 0) {
        const savedResumes = localStorage.getItem('resumes');
        if (savedResumes) {
          const resumes = JSON.parse(savedResumes);
          resumeData = resumes.find((resume: any) => 
            resume.title === application.resumeUsed || 
            `${resume.personalInfo?.fullName || 'Untitled'} Resume` === application.resumeUsed
          );
        }
      }

      // Create the formatted header with actual user information
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      let coverLetterHeader = '';
      if (resumeData && resumeData.personalInfo) {
        const { fullName, email, phone, location } = resumeData.personalInfo;
        coverLetterHeader = `${fullName || ''}
${location || ''}
${phone || ''}
${email || ''}

${currentDate}

Hiring Manager
${application.company}

Dear Hiring Manager,

`;
      } else {
        coverLetterHeader = `${currentDate}

Hiring Manager
${application.company}

Dear Hiring Manager,

`;
      }

      const systemPrompt = `You are an expert professional career coach and resume writer. Create a compelling cover letter body (do NOT include header information as it will be added separately). Focus on:

1. Strong opening that connects the candidate to the specific role
2. 1-2 paragraphs highlighting relevant experience and achievements from the resume
3. A paragraph showing understanding of the company/role and how the candidate adds value
4. Professional closing with call to action

Use specific details from the resume. Do not use any placeholder text. Be professional, confident, and tailored to the job description.`;

      const userPrompt = `Create a professional cover letter BODY ONLY (no header, no contact info, no date) for a ${application.position} position at ${application.company}.

${resumeData ? `RESUME DATA:
Name: ${resumeData.personalInfo?.fullName || 'N/A'}
Email: ${resumeData.personalInfo?.email || 'N/A'}
Summary: ${resumeData.personalInfo?.summary || 'N/A'}

Work Experience:
${resumeData.experiences?.map((exp: any) => `
- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
  ${exp.description}
`).join('') || 'N/A'}

Education:
${resumeData.education?.map((edu: any) => `- ${edu.degree} from ${edu.school}`).join('\n') || 'N/A'}

Skills: ${resumeData.skills?.map((skill: any) => skill.name).join(', ') || 'N/A'}
` : ''}

JOB DESCRIPTION: ${application.jobDescription || 'Standard job requirements for this position'}

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
        
        if (editingApp) {
          setEditingApp({ ...editingApp, coverLetter: completeCoverLetter });
        } else {
          setNewApplication(prev => ({ ...prev, coverLetter: completeCoverLetter }));
        }
        
        const wordCount = generatedBody.split(' ').length;
        toast({
          title: "Cover Letter Generated!",
          description: `Your AI-powered cover letter has been created (${wordCount} words).`,
        });
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate cover letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const fillDemoData = () => {
    setNewApplication({
      company: 'Google',
      position: 'Senior Software Engineer',
      location: 'Mountain View, CA',
      jobUrl: 'https://careers.google.com/jobs/results/',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      resumeUsed: availableResumes[0]?.title || 'Software Engineer Resume',
      coverLetter: '',
      notes: 'Applied through company website',
      salary: '$150,000 - $200,000',
      jobDescription: 'We are looking for a Senior Software Engineer to join our team and help build the next generation of our products. You will work on large-scale distributed systems, collaborate with cross-functional teams, and mentor junior engineers. Requirements: 5+ years of software engineering experience, proficiency in Java/Python/Go, experience with microservices architecture, strong problem-solving skills.'
    });

    toast({
      title: "Demo Data Filled!",
      description: "All fields have been populated with sample data.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-yellow-100 text-yellow-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStats = () => {
    return {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      interview: applications.filter(app => app.status === 'interview').length,
      offer: applications.filter(app => app.status === 'offer').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = getStatusStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading job applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Application Tracker</h1>
          <p className="text-muted-foreground">Track and manage all your job applications with real-time sync</p>
        </div>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Job Application</DialogTitle>
              <DialogDescription>
                Track a new job application and generate AI-powered content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={fillDemoData} variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Zap className="mr-2 h-4 w-4" />
                  Fill Demo Data
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Company Name *"
                  value={newApplication.company}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, company: e.target.value }))}
                />
                <Input
                  placeholder="Position *"
                  value={newApplication.position}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, position: e.target.value }))}
                />
                <Input
                  placeholder="Location"
                  value={newApplication.location}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, location: e.target.value }))}
                />
                <Input
                  placeholder="Job URL"
                  value={newApplication.jobUrl}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, jobUrl: e.target.value }))}
                />
                <Input
                  placeholder="Salary Range"
                  value={newApplication.salary}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, salary: e.target.value }))}
                />
                <Input
                  type="date"
                  value={newApplication.appliedDate}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, appliedDate: e.target.value }))}
                />
              </div>
              
              <Select value={newApplication.status} onValueChange={(value) => setNewApplication(prev => ({ ...prev, status: value as JobApplication['status'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Application Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <label className="block text-sm font-medium mb-2">Resume Used</label>
                <Select value={newApplication.resumeUsed} onValueChange={(value) => setNewApplication(prev => ({ ...prev, resumeUsed: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resume used" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableResumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.title}>
                        {resume.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here for AI analysis..."
                  value={newApplication.jobDescription}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, jobDescription: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Cover Letter</label>
                  <Button
                    onClick={() => generateCoverLetter(newApplication)}
                    disabled={isGeneratingCoverLetter}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGeneratingCoverLetter ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
                <Textarea
                  placeholder="Your cover letter..."
                  value={newApplication.coverLetter}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, coverLetter: e.target.value }))}
                  rows={6}
                />
              </div>

              <Textarea
                placeholder="Notes (interview feedback, follow-up actions, etc.)"
                value={newApplication.notes}
                onChange={(e) => setNewApplication(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={addApplication}>
                  Add Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
            <CardDescription>Total Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-600">{stats.applied}</CardTitle>
            <CardDescription>Applied</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-yellow-600">{stats.interview}</CardTitle>
            <CardDescription>Interviews</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">{stats.offer}</CardTitle>
            <CardDescription>Offers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-red-600">{stats.rejected}</CardTitle>
            <CardDescription>Rejected</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search companies or positions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4">
                {applications.length === 0 
                  ? "Start tracking your job applications to stay organized"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {applications.length === 0 && (
                <Button 
                  onClick={() => setIsAddingNew(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Add Your First Application
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{app.position}</CardTitle>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600 space-x-4 text-sm">
                      <div className="flex items-center">
                        <Building className="mr-1 h-4 w-4" />
                        {app.company}
                      </div>
                      {app.location && (
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {app.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                    {app.salary && (
                      <p className="text-sm text-green-600 mt-1 font-medium">{app.salary}</p>
                    )}
                    {app.notes && (
                      <p className="text-sm text-gray-600 mt-2">{app.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {app.jobUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingApp(app)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteApplication(app.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingApp && (
        <Dialog open={!!editingApp} onOpenChange={() => setEditingApp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Application</DialogTitle>
              <DialogDescription>
                Update your job application details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Company Name"
                  value={editingApp.company}
                  onChange={(e) => setEditingApp({ ...editingApp, company: e.target.value })}
                />
                <Input
                  placeholder="Position"
                  value={editingApp.position}
                  onChange={(e) => setEditingApp({ ...editingApp, position: e.target.value })}
                />
              </div>
              
              <Select value={editingApp.status} onValueChange={(value) => setEditingApp({ ...editingApp, status: value as JobApplication['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <label className="block text-sm font-medium mb-2">Resume Used</label>
                <Select value={editingApp.resumeUsed} onValueChange={(value) => setEditingApp({ ...editingApp, resumeUsed: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableResumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.title}>
                        {resume.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description</label>
                <Textarea
                  placeholder="Job description..."
                  value={editingApp.jobDescription}
                  onChange={(e) => setEditingApp({ ...editingApp, jobDescription: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Cover Letter</label>
                  <Button
                    onClick={() => generateCoverLetter(editingApp)}
                    disabled={isGeneratingCoverLetter}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGeneratingCoverLetter ? 'Generating...' : 'Regenerate with AI'}
                  </Button>
                </div>
                <Textarea
                  value={editingApp.coverLetter}
                  onChange={(e) => setEditingApp({ ...editingApp, coverLetter: e.target.value })}
                  rows={6}
                />
              </div>

              <Textarea
                placeholder="Notes"
                value={editingApp.notes}
                onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                rows={3}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingApp(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateApplication(editingApp)}>
                  Update Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default JobTracker;
