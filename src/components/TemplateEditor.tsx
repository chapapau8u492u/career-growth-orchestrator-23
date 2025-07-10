
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye, Upload, AlertTriangle, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Template, TemplateEngine, ResumeData } from "@/utils/templateEngine";

interface TemplateEditorProps {
  template: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const TemplateEditor = ({ template, onSave, onCancel, isCreating }: TemplateEditorProps) => {
  const [editedTemplate, setEditedTemplate] = useState<Template>(template);
  const [showPreview, setShowPreview] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });

  // Sample data for preview
  const sampleData: ResumeData = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    linkedIn: "linkedin.com/in/johndoe",
    website: "johndoe.com",
    summary: "Experienced professional with strong background in technology and innovation.",
    experiences: [
      {
        id: "1",
        jobTitle: "Senior Developer",
        company: "Tech Corp",
        location: "New York, NY",
        startDate: "2020-01-01",
        endDate: "",
        current: true,
        description: "Led development team and delivered high-quality software solutions."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor of Computer Science",
        school: "Tech University",
        location: "Boston, MA",
        graduationDate: "2018-05-01"
      }
    ],
    skills: [
      { id: "1", name: "JavaScript", level: "expert" },
      { id: "2", name: "React", level: "advanced" }
    ]
  };

  const handleInputChange = (field: keyof Template, value: any) => {
    const updatedTemplate = {
      ...editedTemplate,
      [field]: value
    };
    
    setEditedTemplate(updatedTemplate);
    
    // Validate template if it's marked as Handlebars
    if (field === 'html' && updatedTemplate.isHandlebars) {
      const validation = TemplateEngine.validateTemplate(value);
      setValidationResult(validation);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('preview', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePreviewHtml = () => {
    return TemplateEngine.generatePreviewHtml(editedTemplate, sampleData);
  };

  const handleSave = () => {
    if (!editedTemplate.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    if (!editedTemplate.html.trim()) {
      alert('Please enter HTML code');
      return;
    }

    // Validate Handlebars template
    if (editedTemplate.isHandlebars) {
      const validation = TemplateEngine.validateTemplate(editedTemplate.html);
      if (!validation.isValid) {
        alert(`Template validation failed:\n${validation.errors.join('\n')}`);
        return;
      }
    }

    onSave(editedTemplate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {isCreating ? 'Create New Template' : `Edit ${template.name}`}
              </h1>
              <p className="text-sm text-gray-600">
                Create dynamic templates using Handlebars syntax
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Template Info */}
            <Card>
              <CardHeader>
                <CardTitle>Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={editedTemplate.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editedTemplate.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter template description"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isHandlebars"
                    checked={editedTemplate.isHandlebars || false}
                    onCheckedChange={(checked) => handleInputChange('isHandlebars', checked)}
                  />
                  <Label htmlFor="isHandlebars">Enable dynamic data rendering (Handlebars)</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasPhoto"
                    checked={editedTemplate.hasPhoto}
                    onCheckedChange={(checked) => handleInputChange('hasPhoto', checked)}
                  />
                  <Label htmlFor="hasPhoto">This template includes a profile photo</Label>
                </div>
                
                <div>
                  <Label htmlFor="preview">Preview Image</Label>
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Preview Image
                        </span>
                      </Button>
                    </label>
                    {editedTemplate.preview && (
                      <div className="mt-2">
                        <img 
                          src={editedTemplate.preview} 
                          alt="Preview" 
                          className="w-20 h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Handlebars Guide */}
            {editedTemplate.isHandlebars && (
              <Card>
                <CardHeader>
                  <CardTitle>Handlebars Template Guide</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>Variables:</strong> <code>{'{{fullName}}'}</code>, <code>{'{{email}}'}</code>, <code>{'{{phone}}'}</code>, <code>{'{{summary}}'}</code></p>
                  <p><strong>Conditionals:</strong> <code>{'{{#if summary}}'}...{'{{/if}}'}</code></p>
                  <p><strong>Loops:</strong> <code>{'{{#each experiences}}'}{'{{jobTitle}}'}{'{{/each}}'}</code></p>
                  <p><strong>Helpers:</strong> <code>{'{{formatDate startDate}}'}</code> for dates</p>
                </CardContent>
              </Card>
            )}

            {/* Validation Result */}
            {editedTemplate.isHandlebars && (
              <Alert className={validationResult.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-center">
                  {validationResult.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className="ml-2">
                    {validationResult.isValid 
                      ? "Template syntax is valid" 
                      : `Validation errors: ${validationResult.errors.join(', ')}`
                    }
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Template Code</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="html" className="mt-4">
                    <Label htmlFor="html">
                      HTML Template Structure
                      {editedTemplate.isHandlebars && <span className="text-blue-600"> (Handlebars Enabled)</span>}
                    </Label>
                    <Textarea
                      id="html"
                      value={editedTemplate.html}
                      onChange={(e) => handleInputChange('html', e.target.value)}
                      placeholder={editedTemplate.isHandlebars 
                        ? "Enter HTML with Handlebars syntax: {{fullName}}, {{#each experiences}}...{{/each}}"
                        : "Enter HTML code..."
                      }
                      rows={20}
                      className="font-mono text-sm mt-2"
                    />
                  </TabsContent>
                  
                  <TabsContent value="css" className="mt-4">
                    <Label htmlFor="css">CSS Styles</Label>
                    <Textarea
                      id="css"
                      value={editedTemplate.css}
                      onChange={(e) => handleInputChange('css', e.target.value)}
                      placeholder="Enter CSS code..."
                      rows={20}
                      className="font-mono text-sm mt-2"
                    />
                  </TabsContent>
                  
                  <TabsContent value="js" className="mt-4">
                    <Label htmlFor="js">JavaScript (Optional)</Label>
                    <Textarea
                      id="js"
                      value={editedTemplate.js || ''}
                      onChange={(e) => handleInputChange('js', e.target.value)}
                      placeholder="Enter JavaScript code..."
                      rows={20}
                      className="font-mono text-sm mt-2"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  {editedTemplate.isHandlebars && (
                    <p className="text-sm text-gray-600">Preview with sample resume data</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <iframe
                      srcDoc={generatePreviewHtml()}
                      className="w-full h-[600px]"
                      sandbox="allow-scripts"
                      title="Template Preview"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
