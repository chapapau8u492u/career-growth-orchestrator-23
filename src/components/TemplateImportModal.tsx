
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Code, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (templateData: any) => void;
}

const TemplateImportModal = ({ isOpen, onClose, onImport }: TemplateImportModalProps) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);
  const { toast } = useToast();

  const handleImport = () => {
    if (!templateName || !htmlCode) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a template name and HTML code.",
        variant: "destructive"
      });
      return;
    }

    const templateData = {
      id: `custom-${Date.now()}`,
      name: templateName,
      description: templateDescription || 'Custom imported template',
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      hasPhoto,
      isCustom: true
    };

    // Save to localStorage
    const existingCustomTemplates = localStorage.getItem('customTemplates');
    const customTemplates = existingCustomTemplates ? JSON.parse(existingCustomTemplates) : [];
    customTemplates.push(templateData);
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));

    onImport(templateData);
    
    toast({
      title: "Template Imported!",
      description: "Your custom template has been successfully imported.",
    });

    // Reset form
    setTemplateName('');
    setTemplateDescription('');
    setHtmlCode('');
    setCssCode('');
    setJsCode('');
    setHasPhoto(true);
    
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'html' | 'css' | 'js') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        switch (type) {
          case 'html':
            setHtmlCode(content);
            break;
          case 'css':
            setCssCode(content);
            break;
          case 'js':
            setJsCode(content);
            break;
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Import Custom Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Warning */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Security Notice</p>
                  <p className="text-yellow-700">Only import templates from trusted sources. Custom JavaScript will be executed in your browser.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Template Name *</label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My Custom Template"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="A beautiful custom resume template"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasPhoto"
              checked={hasPhoto}
              onChange={(e) => setHasPhoto(e.target.checked)}
            />
            <label htmlFor="hasPhoto" className="text-sm">This template includes a profile photo</label>
          </div>

          {/* Code Sections */}
          <div className="space-y-4">
            {/* HTML */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">HTML Template *</CardTitle>
                <CardDescription>The main structure of your resume template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".html,.htm"
                      onChange={(e) => handleFileUpload(e, 'html')}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload HTML
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="<div class='resume'>...</div>"
                  rows={8}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* CSS */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">CSS Styles</CardTitle>
                <CardDescription>Styling for your template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".css"
                      onChange={(e) => handleFileUpload(e, 'css')}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload CSS
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder=".resume { font-family: Arial, sans-serif; }"
                  rows={6}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            {/* JavaScript */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">JavaScript (Optional)</CardTitle>
                <CardDescription>Interactive functionality for your template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".js"
                      onChange={(e) => handleFileUpload(e, 'js')}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload JS
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="// Optional JavaScript code"
                  rows={4}
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport}>Import Template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateImportModal;
