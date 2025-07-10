
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TemplatesPage = () => {
  const navigate = useNavigate();

  const handleManageTemplates = () => {
    navigate('/resume/templates');
  };

  const templates = [
    { 
      id: 'modern', 
      name: 'Modern', 
      description: 'Clean gradient design with blue accents',
      category: 'Professional',
      preview: '/lovable-uploads/modern.png',
      hasPhoto: false,
      premium: false
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      description: 'Classic business resume format',
      category: 'Business',
      preview: '/lovable-uploads/professional.png',
      hasPhoto: true,
      premium: false
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Colorful design with personal branding',
      category: 'Creative',
      preview: '/lovable-uploads/creative.png',
      hasPhoto: true,
      premium: true
    },
    { 
      id: 'sidebar', 
      name: 'Sidebar', 
      description: 'Two-column layout with dark sidebar',
      category: 'Modern',
      preview: '/lovable-uploads/sidebar.png',
      hasPhoto: true,
      premium: false
    },
    { 
      id: 'elegant', 
      name: 'Elegant', 
      description: 'Sophisticated minimal design',
      category: 'Minimal',
      preview: '/lovable-uploads/elegant.png',
      hasPhoto: true,
      premium: true
    },
    { 
      id: 'student', 
      name: 'Student', 
      description: 'Bold design for students and new graduates',
      category: 'Student',
      preview: '/lovable-uploads/student.png',
      hasPhoto: true,
      premium: false
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/resume')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resume AI
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Templates</h1>
            <p className="text-gray-600">Choose from our collection of professionally designed templates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={handleManageTemplates} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Manage Templates
          </Button>
          <Button variant="outline" onClick={handleManageTemplates} className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Create Custom Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow group relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  {template.premium && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                      Premium
                    </Badge>
                  )}
                  {template.hasPhoto && (
                    <Badge variant="outline" className="text-xs">
                      Has Photo
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
              <Badge variant="outline" className="w-fit">
                {template.category}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-100 rounded mb-4 overflow-hidden">
                <img 
                  src={template.preview} 
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDIwMCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzM5ODBGRiIvPgo8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIGZpbGw9IiNEMUQ1REIiLz4KPHJlY3QgeD0iMjAiIHk9IjgwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRDFENURCIi8+CjxyZWN0IHg9IjIwIiB5PSIxMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIxNSIgZmlsbD0iIzM5ODBGRiIvPgo8cmVjdCB4PSIyMCIgeT0iMTQ1IiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjgiIGZpbGw9IiNEMUQ1REIiLz4KPHJlY3QgeD0iMjAiIHk9IjE2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPlRlbXBsYXRlIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPgo=';
                  }}
                />
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1" onClick={() => navigate(`/resume/edit/new?template=${template.id}`)}>
                  <Download className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Need a Custom Template?</h3>
        <p className="text-blue-700 mb-4">
          Create your own custom template with our advanced template editor. You can design templates using HTML, CSS, and Handlebars for dynamic content.
        </p>
        <Button onClick={handleManageTemplates} className="bg-blue-600 hover:bg-blue-700">
          Open Template Manager
        </Button>
      </div>
    </div>
  );
};

export default TemplatesPage;
