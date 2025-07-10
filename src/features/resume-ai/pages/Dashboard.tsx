
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, Edit3, Trash2, Calendar, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resumeApi, Resume } from "@/api/resumeApi";

const ResumeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const fetchedResumes = await resumeApi.getResumes();
      console.log('Loaded resumes:', fetchedResumes);
      setResumes(fetchedResumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
      toast({
        title: "Error Loading Resumes",
        description: "Could not load your resumes. Please try again.",
        variant: "destructive"
      });
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeApi.deleteResume(resumeId);
      setResumes(resumes.filter(resume => resume.id !== resumeId));
      toast({
        title: "Resume Deleted",
        description: "Your resume has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast({
        title: "Error Deleting Resume",
        description: "Could not delete the resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Dashboard</h1>
            <p className="text-gray-600 mt-1">Create and manage your professional resumes</p>
          </div>
          <Button 
            onClick={() => navigate('/resume/create')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Resume
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
                  <p className="text-gray-600">Total Resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {resumes.reduce((sum, resume) => sum + (resume.jobApplications || 0), 0)}
                  </p>
                  <p className="text-gray-600">Applications Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {resumes.filter(r => r.status === 'completed').length}
                  </p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-6">Create your first resume to get started with your job search.</p>
              <Button 
                onClick={() => navigate('/resume/create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {resume.personalInfo?.fullName || resume.personalInfo?.firstName + ' ' + resume.personalInfo?.lastName || 'Unnamed'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(resume.status || 'draft')}>
                      {resume.status || 'draft'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Template:</span>
                      <span className="capitalize">{resume.template || 'modern'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Applications:</span>
                      <span>{resume.jobApplications || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>{resume.updatedAt ? formatDate(resume.updatedAt) : 'Never'}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/resume/preview/${resume.id}`)}
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/resume/edit/${resume.id}`)}
                      className="flex-1"
                    >
                      <Edit3 className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.id!)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDashboard;
