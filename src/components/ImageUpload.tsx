
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, User, X, Camera } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  show: boolean;
}

const ImageUpload = ({ currentImage, onImageChange, show }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  if (!show) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Profile Photo</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentImage && (
              <div className="flex items-center space-x-2">
                <img src={currentImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <Button
                  type="button"
                  onClick={() => onImageChange(null)}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                key={currentImage ? 'has-image' : 'no-image'}
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="mr-2 h-3 w-3" />
                {currentImage ? 'Change' : 'Upload'}
              </Button>
            </label>
            
            {!currentImage && (
              <Button
                type="button"
                onClick={() => onImageChange(null)}
                variant="outline"
                size="sm"
              >
                <User className="mr-2 h-3 w-3" />
                None
              </Button>
            )}
          </div>
        </div>

        {/* Drag and drop area */}
        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag and drop an image here, or click the Upload button above
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
