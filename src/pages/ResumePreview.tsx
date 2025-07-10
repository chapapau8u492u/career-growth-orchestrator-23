
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Edit, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
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

interface Resume {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

const ResumePreview = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadResume = () => {
      const savedResumes = localStorage.getItem('resumes');
      if (savedResumes) {
        const resumes = JSON.parse(savedResumes);
        const foundResume = resumes.find((r: Resume) => r.id === id);
        if (foundResume) {
          setResume(foundResume);
        } else {
          toast({
            title: "Resume Not Found",
            description: "The requested resume could not be found.",
            variant: "destructive"
          });
        }
      }
      setIsLoading(false);
    };

    if (id) {
      loadResume();
    }
  }, [id, toast]);

  const downloadResume = () => {
    if (!resume) return;
    
    // Create a simplified version for download
    const resumeContent = `
${resume.personalInfo.fullName}
${resume.personalInfo.email} | ${resume.personalInfo.phone}
${resume.personalInfo.location}
${resume.personalInfo.linkedIn ? `LinkedIn: ${resume.personalInfo.linkedIn}` : ''}
${resume.personalInfo.website ? `Website: ${resume.personalInfo.website}` : ''}

PROFESSIONAL SUMMARY
${resume.personalInfo.summary}

WORK EXPERIENCE
${resume.experiences.map(exp => `
${exp.jobTitle} at ${exp.company}
${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.description}
`).join('\n')}

EDUCATION
${resume.education.map(edu => `
${edu.degree} - ${edu.school}
${edu.location} | ${edu.graduationDate}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
`).join('\n')}

SKILLS
${resume.skills.map(skill => skill.name).join(', ')}
    `;

    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName || 'Resume'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your resume has been downloaded as a text file.",
    });
  };

  const shareResume = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: resume?.title || 'My Resume',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Resume link has been copied to clipboard.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatBulletPoints = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        return (
          <li key={index} className="ml-4">
            {trimmedLine.substring(1).trim()}
          </li>
        );
      }
      return trimmedLine ? <p key={index} className="mb-2">{trimmedLine}</p> : null;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Resume Not Found</h2>
            <p className="text-gray-600 mb-4">The requested resume could not be found.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-container { 
              max-width: none !important; 
              margin: 0 !important; 
              padding: 0 !important; 
            }
            body { font-size: 12px; }
          }
        `}
      </style>

      {/* Header - No Print */}
      <header className="bg-white border-b no-print">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{resume.title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={shareResume} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={downloadResume} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Link to={`/edit-resume/${resume.id}`}>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit Resume
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Resume Content */}
      <div className="container mx-auto px-4 py-8 print-container">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{resume.personalInfo.fullName}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              {resume.personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {resume.personalInfo.email}
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="mr-1 h-4 w-4" />
                  {resume.personalInfo.phone}
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {resume.personalInfo.location}
                </div>
              )}
              {resume.personalInfo.linkedIn && (
                <div className="flex items-center">
                  <Linkedin className="mr-1 h-4 w-4" />
                  <a href={resume.personalInfo.linkedIn} className="hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {resume.personalInfo.website && (
                <div className="flex items-center">
                  <Globe className="mr-1 h-4 w-4" />
                  <a href={resume.personalInfo.website} className="hover:underline">
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Professional Summary */}
            {resume.personalInfo.summary && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-200 pb-1">
                  PROFESSIONAL SUMMARY
                </h2>
                <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
              </section>
            )}

            {/* Work Experience */}
            {resume.experiences && resume.experiences.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-1">
                  WORK EXPERIENCE
                </h2>
                <div className="space-y-6">
                  {resume.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{exp.location}</p>
                          <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 text-sm leading-relaxed">
                          <ul className="list-none">
                            {formatBulletPoints(exp.description)}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-1">
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-blue-600">{edu.school}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{edu.location}</p>
                        <p>{formatDate(edu.graduationDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-1">
                  SKILLS
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer - No Print */}
        <div className="text-center mt-8 no-print">
          <p className="text-gray-600 text-sm">
            Created with Resume Craftsman Pro • Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
