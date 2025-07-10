
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Code } from "lucide-react";
import { Template, TemplateEngine, ResumeData } from "@/utils/templateEngine";

interface TemplatePreviewProps {
  template: Template;
  onBack: () => void;
}

const TemplatePreview = ({ template, onBack }: TemplatePreviewProps) => {
  // Sample resume data for preview
  const sampleData: ResumeData = {
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/johnsmith",
    website: "johnsmith.dev",
    summary: "Experienced software engineer with 5+ years of experience in full-stack development. Passionate about creating scalable web applications and leading development teams.",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    experiences: [
      {
        id: "1",
        jobTitle: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        startDate: "2021-03-01",
        endDate: "",
        current: true,
        description: "Lead a team of 4 developers in building scalable web applications using React and Node.js. Implemented CI/CD pipelines and improved deployment efficiency by 40%."
      },
      {
        id: "2",
        jobTitle: "Software Developer",
        company: "StartupXYZ",
        location: "San Jose, CA",
        startDate: "2019-06-01",
        endDate: "2021-02-28",
        current: false,
        description: "Developed and maintained multiple client-facing applications. Built RESTful APIs and integrated third-party services."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor of Science in Computer Science",
        school: "Stanford University",
        location: "Stanford, CA",
        graduationDate: "2019-05-01",
        gpa: "3.8"
      }
    ],
    skills: [
      { id: "1", name: "JavaScript", level: "expert" },
      { id: "2", name: "React", level: "expert" },
      { id: "3", name: "Node.js", level: "advanced" },
      { id: "4", name: "Python", level: "intermediate" },
      { id: "5", name: "AWS", level: "intermediate" }
    ]
  };

  const generatePreviewHtml = () => {
    return TemplateEngine.generatePreviewHtml(template, sampleData);
  };

  const handleDownload = () => {
    const htmlContent = generatePreviewHtml();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewSource = () => {
    const htmlContent = generatePreviewHtml();
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<pre><code>${htmlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
      newWindow.document.title = `${template.name} - Source Code`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{template.name}</h1>
              <p className="text-sm text-gray-600">{template.description}</p>
              {template.isHandlebars && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  Dynamic Template
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleViewSource}>
              <Code className="mr-2 h-4 w-4" />
              View Source
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download HTML
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {template.isHandlebars && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Preview with Sample Data:</strong> This template uses dynamic data rendering. 
                The preview shows how it will look with sample resume information.
              </p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              srcDoc={generatePreviewHtml()}
              className="w-full h-[800px]"
              sandbox="allow-scripts"
              title={`${template.name} Preview`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
