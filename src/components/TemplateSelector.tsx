
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Layout, Plus } from "lucide-react";
import TemplateModal from "./TemplateModal";
import TemplateImportModal from "./TemplateImportModal";

interface TemplateSelectorProps {
  selectedTemplate: string;
  selectedColor: string;
  onTemplateChange: (template: string) => void;
  onColorChange: (color: string) => void;
}

const TemplateSelector = ({ selectedTemplate, selectedColor, onTemplateChange, onColorChange }: TemplateSelectorProps) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  const getTemplateName = (id: string) => {
    const templates = {
      'modern': 'Modern',
      'professional': 'Professional', 
      'creative': 'Creative',
      'sidebar': 'Sidebar',
      'elegant': 'Elegant',
      'student': 'Student',
      'minimal': 'Minimal',
      'ats': 'ATS-Friendly'
    };
    return templates[id as keyof typeof templates] || 'Unknown';
  };

  const handleTemplateImport = (templateData: any) => {
    // Handle imported template
    onTemplateChange(templateData.id);
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Template Selection */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowTemplateModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Layout className="mr-2 h-4 w-4" />
                {getTemplateName(selectedTemplate)}
              </Button>
              
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>

            {/* Color Selection */}
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-gray-500" />
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onColorChange(color.value)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === color.value ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={onTemplateChange}
      />

      <TemplateImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleTemplateImport}
      />
    </>
  );
};

export default TemplateSelector;
