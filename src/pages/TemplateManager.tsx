
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Edit, Trash2, Eye, Code2, Import } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import TemplateEditor from "@/components/TemplateEditor";
import TemplatePreview from "@/components/TemplatePreview";
import TemplateImportModal from "@/components/TemplateImportModal";
import { Template } from "@/utils/templateEngine";
import { defaultTemplates } from "@/data/defaultTemplates";

const TemplateManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'grid' | 'editor' | 'preview'>('grid');

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    // Load custom templates from localStorage
    const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    
    // Combine default and custom templates
    setTemplates([...defaultTemplates, ...customTemplates]);
  };

  const handleCreateNew = () => {
    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: 'New Template',
      description: 'Custom Handlebars template',
      preview: '',
      hasPhoto: true,
      isHandlebars: true,
      html: `<div class="resume-template">
  <div class="header">
    <h1 class="name">{{fullName}}</h1>
    {{#if experiences.[0].jobTitle}}
      <p class="title">{{experiences.[0].jobTitle}}</p>
    {{/if}}
    <div class="contact">
      {{#if email}}<span>{{email}}</span>{{/if}}
      {{#if phone}} | <span>{{phone}}</span>{{/if}}
      {{#if location}} | <span>{{location}}</span>{{/if}}
    </div>
  </div>
  
  {{#if summary}}
    <section class="section">
      <h2>Professional Summary</h2>
      <p>{{summary}}</p>
    </section>
  {{/if}}
  
  {{#if experiences}}
    <section class="section">
      <h2>Work Experience</h2>
      {{#each experiences}}
        <div class="job">
          <h3>{{jobTitle}} - {{company}}</h3>
          <p class="job-meta">{{location}} | {{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}}</p>
          {{#if description}}<p class="description">{{description}}</p>{{/if}}
        </div>
      {{/each}}
    </section>
  {{/if}}
  
  {{#if skills}}
    <section class="section">
      <h2>Skills</h2>
      <div class="skills">
        {{#each skills}}
          <span class="skill">{{name}}</span>
        {{/each}}
      </div>
    </section>
  {{/if}}
</div>`,
      css: `.resume-template {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  line-height: 1.6;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #3B82F6;
  padding-bottom: 1rem;
}

.name {
  font-size: 2.5rem;
  margin: 0;
  color: #3B82F6;
}

.title {
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0;
}

.contact {
  color: #666;
  font-size: 0.95rem;
}

.section {
  margin-bottom: 2rem;
}

.section h2 {
  color: #3B82F6;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.job {
  margin-bottom: 1.5rem;
}

.job h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.job-meta {
  color: #666;
  font-style: italic;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.description {
  margin: 0;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill {
  background: #f0f9ff;
  color: #3B82F6;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}`,
      js: '',
      isCustom: true
    };
    
    setSelectedTemplate(newTemplate);
    setIsCreating(true);
    setIsEditing(true);
    setPreviewMode('editor');
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setPreviewMode('editor');
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewMode('preview');
  };

  const handleSave = (updatedTemplate: Template) => {
    let updatedTemplates;
    
    if (isCreating) {
      updatedTemplates = [...templates, updatedTemplate];
      setIsCreating(false);
    } else {
      updatedTemplates = templates.map(t => 
        t.id === updatedTemplate.id ? updatedTemplate : t
      );
    }
    
    setTemplates(updatedTemplates);
    
    // Save custom templates to localStorage
    const customTemplates = updatedTemplates.filter(t => t.isCustom);
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
    
    toast({
      title: "Template Saved",
      description: "Your template has been successfully saved.",
    });
    
    setIsEditing(false);
    setPreviewMode('grid');
    setSelectedTemplate(null);
  };

  const handleDelete = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && !template.isCustom) {
      toast({
        title: "Cannot Delete",
        description: "Default templates cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    
    // Update localStorage
    const customTemplates = updatedTemplates.filter(t => t.isCustom);
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
    
    toast({
      title: "Template Deleted",
      description: "The template has been successfully deleted.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setPreviewMode('grid');
    setSelectedTemplate(null);
  };

  const handleImport = (templateData: Template) => {
    const updatedTemplates = [...templates, templateData];
    setTemplates(updatedTemplates);
    loadTemplates(); // Reload to get the updated list
  };

  if (previewMode === 'editor' && selectedTemplate) {
    return (
      <TemplateEditor
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
        isCreating={isCreating}
      />
    );
  }

  if (previewMode === 'preview' && selectedTemplate) {
    return (
      <TemplatePreview
        template={selectedTemplate}
        onBack={() => setPreviewMode('grid')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Manager</h1>
              <p className="text-gray-600">Create, edit, and manage dynamic resume templates with Handlebars</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowImportModal(true)} variant="outline">
              <Import className="mr-2 h-4 w-4" />
              Import Template
            </Button>
            <Button onClick={handleCreateNew} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <Code2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Dynamic Template System</p>
              <p className="text-blue-700 mt-1">
                Templates now support Handlebars syntax for dynamic data rendering. Use variables like <code className="bg-blue-100 px-1 rounded">{'{{fullName}}'}</code>, 
                <code className="bg-blue-100 px-1 rounded"> {'{{email}}'}</code>, and loops like <code className="bg-blue-100 px-1 rounded">{'{{#each experiences}}'}...{'{{/each}}'}</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex gap-1">
                    {template.isCustom && (
                      <Badge variant="secondary">Custom</Badge>
                    )}
                    {template.isHandlebars && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Dynamic
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="aspect-[3/4] bg-gray-100 rounded mb-4 overflow-hidden">
                  {template.preview ? (
                    <img 
                      src={template.preview} 
                      alt={`${template.name} preview`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Preview
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  {template.hasPhoto && (
                    <Badge variant="outline" className="text-xs">Has Photo</Badge>
                  )}
                </div>
                
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(template)}
                    className="flex-1"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  {template.isCustom && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <TemplateImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default TemplateManager;
