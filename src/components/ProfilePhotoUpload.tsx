
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, X } from "lucide-react";

interface ProfilePhotoUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
}

const ProfilePhotoUpload = ({ currentImage, onImageChange }: ProfilePhotoUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

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

      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById('profile-photo-input') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={currentImage} />
        <AvatarFallback>
          <User className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center space-x-2">
        <input
          id="profile-photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
        <Button 
          type="button" 
          onClick={handleButtonClick}
          variant="outline" 
          size="sm" 
          disabled={isLoading}
          className="flex items-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isLoading ? 'Uploading...' : currentImage ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        {currentImage && (
          <Button
            type="button"
            onClick={() => onImageChange(null)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
