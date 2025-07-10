
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const CreateResumePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumeName, setResumeName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const templates = [
    { id: 1, name: 'Professional', description: 'Clean and corporate design for traditional industries' },
    { id: 2, name: 'Modern', description: 'Contemporary layout with accent colors for tech roles' },
    { id: 3, name: 'Minimal', description: 'Simple and elegant design focusing on content' },
    { id: 4, name: 'Creative', description: 'Unique layout for creative and design fields' },
  ];

  const handleCreateResume = () => {
    if (!resumeName.trim()) {
      toast({
        title: "Resume Name Required",
        description: "Please enter a descriptive name for your resume (e.g., SDE Resume, Frontend Developer, Marketing Specialist)",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a template for your resume",
        variant: "destructive"
      });
      return;
    }

    // Navigate to edit page with template and name
    navigate(`/resume/edit/new?template=${selectedTemplate}&name=${encodeURIComponent(resumeName.trim())}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/resume')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resume Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Resume</h1>
          <p className="text-gray-600">Choose a template and name your resume for easy identification</p>
        </div>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Resume Details</CardTitle>
            <CardDescription>
              Give your resume a descriptive name that helps you identify it when applying to jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="resumeName">Resume Name *</Label>
              <Input
                id="resumeName"
                placeholder="e.g., SDE Resume, Frontend Developer, Backend Engineer, Marketing Specialist, Data Analyst"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                className="max-w-md"
              />
              <p className="text-sm text-gray-500">
                This name will be displayed in the job tracker extension and help you choose the right resume for each application
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleCreateResume}
          disabled={!resumeName.trim() || !selectedTemplate}
          size="lg"
          className="px-8"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Resume with AI Assistance
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>After creating your resume, you can use AI to generate professional content for each section</p>
      </div>
    </div>
  );
};

export default CreateResumePage;
