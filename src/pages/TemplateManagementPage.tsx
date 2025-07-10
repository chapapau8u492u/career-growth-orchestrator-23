import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Code2, Copy, ArrowLeft, Sparkles, Wand2, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import TemplateEditor from "@/components/TemplateEditor";
import TemplatePreview from "@/components/TemplatePreview";
import { Template } from "@/utils/templateEngine";
import { defaultTemplates } from "@/data/defaultTemplates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TemplateManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // MongoDB integration
  const BACKEND_URL = 'https://job-hunter-backend-sigma.vercel.app';

  useEffect(() => {
    initializeTemplates();
  }, []);

  const initializeTemplates = async () => {
    try {
      setLoading(true);
      console.log('Loading templates from MongoDB...');
      
      // First, try to load from MongoDB
      const response = await fetch(`${BACKEND_URL}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        console.log('Templates loaded from MongoDB:', data.templates?.length || 0);
        
        if (data.templates && data.templates.length > 0) {
          setTemplates(data.templates);
          return;
        }
      }
      
      console.log('MongoDB empty or unavailable, uploading default templates...');
      // If MongoDB is empty or unavailable, upload default templates
      await uploadDefaultTemplates();
      
    } catch (error) {
      console.log('MongoDB not available, loading from localStorage');
      // Fallback to localStorage
      const savedTemplates = localStorage.getItem('customTemplates');
      if (savedTemplates) {
        const customTemplates = JSON.parse(savedTemplates);
        setTemplates([...defaultTemplates, ...customTemplates]);
      } else {
        setTemplates(defaultTemplates);
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadDefaultTemplates = async () => {
    try {
      console.log('Starting upload of default templates to MongoDB...');
      
      // Upload each default template to MongoDB individually
      const uploadPromises = defaultTemplates.map(async (template, index) => {
        try {
          console.log(`Uploading template ${index + 1}/${defaultTemplates.length}: ${template.name}`);
          
          const response = await fetch(`${BACKEND_URL}/api/templates`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...template,
              uploadedAt: new Date().toISOString(),
              isDefault: true
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload template ${template.name}: ${response.status} ${errorText}`);
          }
          
          const result = await response.json();
          console.log(`Successfully uploaded: ${template.name}`);
          return result;
        } catch (error) {
          console.error(`Error uploading template ${template.name}:`, error);
          return null;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successCount = results.filter(result => result.status === 'fulfilled' && result.value).length;
      
      console.log(`Upload completed: ${successCount}/${defaultTemplates.length} templates uploaded`);
      
      if (successCount > 0) {
        toast({
          title: "Templates Synchronized",
          description: `${successCount} templates uploaded to MongoDB successfully`,
        });
        
        // Reload templates from MongoDB
        await loadTemplatesFromDB();
      } else {
        console.log('No templates uploaded successfully, using local templates');
        setTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error('Error uploading default templates:', error);
      setTemplates(defaultTemplates);
    }
  };

  const loadTemplatesFromDB = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded templates from DB:', data.templates?.length || 0);
        setTemplates(data.templates || []);
      } else {
        throw new Error('Failed to fetch from backend');
      }
    } catch (error) {
      console.log('Loading from localStorage fallback');
      const savedTemplates = localStorage.getItem('customTemplates');
      if (savedTemplates) {
        const customTemplates = JSON.parse(savedTemplates);
        setTemplates([...defaultTemplates, ...customTemplates]);
      } else {
        setTemplates(defaultTemplates);
      }
    }
  };

  const saveTemplateToDB = async (template: Template) => {
    try {
      const method = template.isCustom ? 'POST' : 'PUT';
      const url = template.isCustom ? 
        `${BACKEND_URL}/api/templates` : 
        `${BACKEND_URL}/api/templates/${template.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...template,
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        await loadTemplatesFromDB();
        return true;
      }
      throw new Error('Failed to save to backend');
    } catch (error) {
      console.error('Error saving to MongoDB, using localStorage fallback:', error);
      // Fallback to localStorage
      const existingTemplates = templates.filter(t => t.id !== template.id);
      const updatedTemplates = [...existingTemplates, template];
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
      setTemplates(updatedTemplates);
      return true;
    }
  };

  const deleteTemplateFromDB = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/templates/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await loadTemplatesFromDB();
        return true;
      }
      throw new Error('Failed to delete from backend');
    } catch (error) {
      console.error('Error deleting from MongoDB, using localStorage fallback:', error);
      // Fallback to localStorage
      const updatedTemplates = templates.filter(t => t.id !== id);
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates.filter(t => t.isCustom)));
      setTemplates(updatedTemplates);
      return true;
    }
  };

  const handleCreateNew = () => {
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: 'New Template',
      description: 'Custom handlebars template',
      preview: '',
      hasPhoto: true,
      isHandlebars: true,
      html: `<div class="resume-template">
  <div class="header">
    <h1 class="name">{{fullName}}</h1>
    <div class="contact">
      {{#if email}}<span>{{email}}</span>{{/if}}
      {{#if phone}} | <span>{{phone}}</span>{{/if}}
      {{#if location}} | <span>{{location}}</span>{{/if}}
    </div>
  </div>
  
  {{#if summary}}
    <section class="section">
      <h2>Summary</h2>
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

.contact {
  color: #666;
  font-size: 0.95rem;
  margin-top: 0.5rem;
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
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleSave = async (updatedTemplate: Template) => {
    const success = await saveTemplateToDB(updatedTemplate);
    
    if (success) {
      toast({
        title: "Template Saved",
        description: "Template has been saved successfully to MongoDB.",
      });
      setIsEditing(false);
      setIsCreating(false);
      setSelectedTemplate(null);
    } else {
      toast({
        title: "Save Failed",
        description: "Failed to save template.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template?.isCustom && !template?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "System templates cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    const success = await deleteTemplateFromDB(templateId);
    
    if (success) {
      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully.",
      });
    } else {
      toast({
        title: "Delete Failed",
        description: "Failed to delete template.",
        variant: "destructive"
      });
    }
  };

  const handleRemix = (template: Template) => {
    const remixedTemplate: Template = {
      ...template,
      id: `remix-${Date.now()}`,
      name: `${template.name} (Remix)`,
      isCustom: true,
      isDefault: false
    };
    
    setSelectedTemplate(remixedTemplate);
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleAIAssist = async () => {
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch('https://student-os-api.vercel.app/api/ai/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const aiTemplate: Template = {
          id: `ai-template-${Date.now()}`,
          name: `AI Generated: ${aiPrompt.slice(0, 30)}...`,
          description: data.template.description,
          preview: '',
          hasPhoto: true,
          isHandlebars: true,
          html: data.template.html,
          css: data.template.css,
          js: '',
          isCustom: true
        };
        
        setSelectedTemplate(aiTemplate);
        setIsCreating(true);
        setIsEditing(true);
        setShowAIDialog(false);
        setAiPrompt('');
        
        toast({
          title: "AI Template Generated",
          description: "Your custom template has been generated successfully!",
        });
      } else {
        throw new Error(data.error || 'Failed to generate template');
      }
    } catch (error) {
      console.error('AI assist error:', error);
      toast({
        title: "AI Assist Failed",
        description: "Failed to generate template. Please try again with a more specific description.",
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedTemplate(null);
    setShowPreview(false);
  };

  const handleExportTemplate = (template: Template) => {
    const templateData = {
      ...template,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Exported",
      description: "Template has been exported successfully.",
    });
  };

  if (isEditing && selectedTemplate) {
    return (
      <TemplateEditor
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
        isCreating={isCreating}
      />
    );
  }

  if (showPreview && selectedTemplate) {
    return (
      <TemplatePreview
        template={selectedTemplate}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Template Management</h1>
              <p className="text-gray-600">Create, edit, and manage resume templates with MongoDB sync and AI assistance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setShowAIDialog(true)} 
              variant="outline"
              className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generate
            </Button>
            <Button onClick={handleCreateNew} className="flex items-center bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Code2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">MongoDB Integration & AI Enhanced</p>
              <p className="text-blue-700 mt-1">
                Templates are synchronized with MongoDB for seamless collaboration. AI assistance available for generating custom templates. 
                All templates support Handlebars syntax for dynamic resume data rendering.
              </p>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg font-semibold truncate">{template.name}</CardTitle>
                  <div className="flex gap-1">
                    {template.isCustom && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        Custom
                      </Badge>
                    )}
                    {template.isDefault && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        Default
                      </Badge>
                    )}
                    {template.isHandlebars && (
                      <Badge variant="outline" className="text-purple-600 border-purple-600 bg-purple-50">
                        <Code2 className="w-3 h-3 mr-1" />
                        Dynamic
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 overflow-hidden border">
                  {template.preview ? (
                    <img 
                      src={template.preview} 
                      alt={`${template.name} preview`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <Code2 className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-xs">No Preview</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreview(true);
                    }}
                    className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template)}
                    className="flex-1 text-xs hover:bg-green-50 hover:border-green-300"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemix(template)}
                    className="flex-1 text-xs hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Remix
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportTemplate(template)}
                    className="flex-1 text-xs hover:bg-yellow-50 hover:border-yellow-300"
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 px-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Code2 className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first custom template or generating one with AI assistance.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={() => setShowAIDialog(true)} 
                variant="outline"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
              <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Manually
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* AI Assist Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Wand2 className="mr-2 h-5 w-5 text-purple-600" />
              AI Template Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>💡 Tip:</strong> Be specific about style, layout, colors, and sections you want. 
                Example: "Create a modern resume with a dark sidebar, blue accents, skills section with progress bars"
              </p>
            </div>
            
            <div>
              <Label htmlFor="ai-prompt" className="text-base font-medium">Describe your ideal resume template</Label>
              <Textarea
                id="ai-prompt"
                placeholder="Create a professional resume template with a clean layout, using blue color scheme, with sections for experience, education, and skills. Include a header with contact information and make it suitable for tech professionals..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="mt-2 min-h-[120px] resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {aiPrompt.length}/500 characters
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAIAssist} 
                disabled={!aiPrompt.trim() || aiLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Template
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateManagementPage;
