
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { resumeApi } from "@/api/resumeApi";

const AIResumeGenerator = () => {
  const [resumeName, setResumeName] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateAIResume = async () => {
    if (!resumeName.trim()) {
      toast({
        title: "Resume Name Required",
        description: "Please provide a name for your resume (e.g., SDE Resume, Frontend Developer, Backend Engineer).",
        variant: "destructive"
      });
      return;
    }

    if (!summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a brief summary about yourself to generate a resume.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate resume data using backend API
      const resumeData = await generateResumeFromSummary(summary, resumeName.trim());
      
      // Create resume in the database
      const newResume = await resumeApi.createResume(resumeData);
      
      toast({
        title: "AI Resume Generated!",
        description: `Your "${resumeName}" resume has been created successfully. You can now edit it further.`,
      });
      
      // Navigate to edit the new resume
      navigate(`/resume/edit/${newResume.id}`);
      
    } catch (error) {
      console.error('Error generating AI resume:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate resume. Please try again or create manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateResumeFromSummary = async (summary: string, resumeName: string) => {
    // Call backend API instead of calling Gemini directly
    try {
      const response = await fetch('https://job-hunter-backend-sigma.vercel.app/api/ai/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary, resumeName })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.resume) {
          return {
            title: resumeName,
            ...data.resume,
            template: 'modern',
            accentColor: '#3B82F6',
            status: 'completed',
            jobApplications: 0
          };
        }
      }
    } catch (error) {
      console.log('Backend API not available, using fallback generation');
    }

    // Intelligent fallback based on summary keywords
    const summaryLower = summary.toLowerCase();
    
    // Extract potential name from summary
    const nameMatch = summary.match(/(?:i am|my name is|i'm)\s+([a-zA-Z\s]+)/i);
    const extractedName = nameMatch ? nameMatch[1].trim() : 'AI Generated User';
    
    // Determine field based on keywords
    let field = 'Technology';
    let jobTitle = 'Software Engineer';
    let skills = ['JavaScript', 'React', 'Node.js'];
    
    if (summaryLower.includes('marketing') || summaryLower.includes('sales')) {
      field = 'Marketing';
      jobTitle = 'Marketing Specialist';
      skills = ['Digital Marketing', 'SEO', 'Content Creation'];
    } else if (summaryLower.includes('design') || summaryLower.includes('creative')) {
      field = 'Design';
      jobTitle = 'UI/UX Designer';
      skills = ['Figma', 'Photoshop', 'User Research'];
    } else if (summaryLower.includes('data') || summaryLower.includes('analyst')) {
      field = 'Data Science';
      jobTitle = 'Data Analyst';
      skills = ['Python', 'SQL', 'Excel'];
    } else if (summaryLower.includes('finance') || summaryLower.includes('accounting')) {
      field = 'Finance';
      jobTitle = 'Financial Analyst';
      skills = ['Excel', 'Financial Modeling', 'QuickBooks'];
    }

    return {
      title: resumeName,
      personalInfo: {
        fullName: extractedName,
        firstName: extractedName.split(' ')[0] || '',
        lastName: extractedName.split(' ').slice(1).join(' ') || '',
        email: 'user@example.com',
        phone: '+1 (555) 123-4567',
        location: 'City, State',
        summary: summary
      },
      experiences: [{
        id: '1',
        jobTitle: jobTitle,
        company: 'Previous Company',
        location: 'City, State',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: `• Responsible for key tasks in ${field.toLowerCase()}\n• Collaborated with cross-functional teams\n• Achieved measurable results and improvements\n• Applied best practices and industry standards`
      }],
      education: [{
        id: '1',
        degree: `Bachelor of Science in ${field}`,
        school: 'University Name',
        location: 'City, State',
        graduationDate: '2022-05',
        gpa: ''
      }],
      skills: skills.map((skill, index) => ({
        id: (index + 1).toString(),
        name: skill,
        level: 'intermediate'
      })),
      template: 'modern',
      accentColor: '#3B82F6',
      status: 'completed',
      jobApplications: 0
    };
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Wand2 className="h-8 w-8 text-purple-600 mr-2" />
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Resume Generator
          </CardTitle>
        </div>
        <CardDescription className="text-lg">
          Name your resume and tell us about yourself - AI will create a professional resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="resumeName" className="text-sm font-medium text-gray-700 mb-2 block">
            Resume Name *
          </Label>
          <Input
            id="resumeName"
            placeholder="e.g., SDE Resume, Frontend Developer, Backend Engineer, Marketing Specialist"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            This name will identify your resume in applications and job tracking.
          </p>
        </div>

        <div>
          <Label htmlFor="summary" className="text-sm font-medium text-gray-700 mb-2 block">
            Tell us about yourself (brief summary) *
          </Label>
          <Textarea
            id="summary"
            placeholder="Example: I am John Smith, a software engineer with 3 years of experience in React and Node.js. I have worked at tech startups and enjoy building scalable web applications..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={6}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include your name, field, experience level, key skills, and career goals for best results.
          </p>
        </div>
        
        <Button
          onClick={generateAIResume}
          disabled={isGenerating || !summary.trim() || !resumeName.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
          size="lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isGenerating ? 'Generating Your Resume...' : 'Generate AI Resume'}
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          <p>AI will create a complete resume with:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Professional summary</li>
            <li>Work experience section</li>
            <li>Education background</li>
            <li>Relevant skills</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResumeGenerator;
