
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
}

const TemplateModal = ({ isOpen, onClose, selectedTemplate, onTemplateSelect }: TemplateModalProps) => {
  const [previewTemplate, setPreviewTemplate] = useState(selectedTemplate);

  const templates = [
    { 
      id: 'modern', 
      name: 'Modern', 
      description: 'Clean gradient design with blue accents',
      preview: '/lovable-uploads/modern.png',
      hasPhoto: false
    },
    { 
      id: 'professional', 
      name: 'Professional', 
      description: 'Classic business resume format',
      preview: '/lovable-uploads/professional.png',
      hasPhoto: true
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Colorful design with personal branding',
      preview: '/lovable-uploads/creative.png',
      hasPhoto: true
    },
    { 
      id: 'sidebar', 
      name: 'Sidebar', 
      description: 'Two-column layout with dark sidebar',
      preview: '/lovable-uploads/sidebar.png',
      hasPhoto: true
    },
    { 
      id: 'elegant', 
      name: 'Elegant', 
      description: 'Sophisticated minimal design',
      preview: '/lovable-uploads/elegant.png',
      hasPhoto: true
    },
    { 
      id: 'student', 
      name: 'Student', 
      description: 'Bold design for students and new graduates',
      preview: '/lovable-uploads/student.png',
      hasPhoto: true
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      description: 'Clean and simple layout',
      preview: '/lovable-uploads/minimal.png',
      hasPhoto: true
    }
  ];

  const handleConfirm = () => {
    onTemplateSelect(previewTemplate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose Your Resume Template</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto p-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative border-2 rounded-lg cursor-pointer transition-colors ${
                previewTemplate === template.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPreviewTemplate(template.id)}
            >
              <div className="p-3">
                <div className="aspect-[3/4] bg-gray-100 rounded mb-2 overflow-hidden">
                  <img 
                    src={template.preview} 
                    alt={`${template.name} template preview`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDIwMCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iIzM5ODBGRiIvPgo8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIGZpbGw9IiNEMUQ1REIiLz4KPHJlY3QgeD0iMjAiIHk9IjgwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRDFENURCIi8+CjxyZWN0IHg9IjIwIiB5PSIxMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIxNSIgZmlsbD0iIzM5ODBGRiIvPgo8cmVjdCB4PSIyMCIgeT0iMTQ1IiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjgiIGZpbGw9IiNEMUQ1REIiLz4KPHJlY3QgeD0iMjAiIHk9IjE2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPlRlbXBsYXRlIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                {template.hasPhoto && (
                  <Badge variant="secondary" className="text-xs">Has Photo</Badge>
                )}
              </div>
              
              {previewTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Apply Template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
