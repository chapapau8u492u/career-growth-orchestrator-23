
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIFieldHelperProps {
  fieldType: 'summary' | 'experience' | 'skills';
  onGenerate: (content: string) => void;
  contextData?: {
    fullName?: string;
    jobTitle?: string;
    company?: string;
    experience?: string;
    skills?: string;
    responsibilities?: string;
    duration?: string;
  };
  placeholder?: string;
}

const AIFieldHelper = ({ fieldType, onGenerate, contextData, placeholder }: AIFieldHelperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const getFieldTitle = () => {
    switch (fieldType) {
      case 'summary':
        return 'AI Professional Summary';
      case 'experience':
        return 'AI Experience Description';
      case 'skills':
        return 'AI Skills Suggestions';
      default:
        return 'AI Content Generator';
    }
  };

  const getFieldDescription = () => {
    switch (fieldType) {
      case 'summary':
        return 'Describe your background briefly, and AI will create a compelling professional summary';
      case 'experience':
        return 'Describe your role and key responsibilities, AI will create impactful bullet points';
      case 'skills':
        return 'Describe your field or role, AI will suggest relevant skills';
      default:
        return 'Provide context and AI will generate relevant content';
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (fieldType) {
      case 'summary':
        return 'e.g., I am a software engineer with 3 years experience in React and Node.js, passionate about building scalable applications...';
      case 'experience':
        return 'e.g., Led development team, implemented new features, improved system performance, managed client relationships...';
      case 'skills':
        return 'e.g., Frontend development, full-stack engineer, data analysis, marketing specialist...';
      default:
        return 'Describe what you need help with...';
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide some context for AI to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      let endpoint = '';
      let requestBody: any = {};

      switch (fieldType) {
        case 'summary':
          endpoint = '/api/ai/generate-summary';
          requestBody = {
            fullName: contextData?.fullName || 'Professional',
            jobTitle: contextData?.jobTitle || 'Professional',
            experience: prompt,
            skills: contextData?.skills
          };
          break;
        case 'experience':
          endpoint = '/api/ai/generate-experience';
          requestBody = {
            jobTitle: contextData?.jobTitle || 'Professional',
            company: contextData?.company || 'Company',
            duration: contextData?.duration,
            responsibilities: prompt
          };
          break;
        case 'skills':
          endpoint = '/api/ai/generate-skills';
          requestBody = {
            fieldDescription: prompt,
            jobTitle: contextData?.jobTitle
          };
          break;
      }

      const response = await fetch(`https://job-hunter-backend-sigma.vercel.app${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onGenerate(data.summary || data.description || data.skills || data.content);
          setIsOpen(false);
          setPrompt('');
          toast({
            title: "Content Generated!",
            description: "AI has generated professional content for you.",
          });
        } else {
          throw new Error(data.error || 'Failed to generate content');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      
      // Provide fallback content
      let fallbackContent = '';
      switch (fieldType) {
        case 'summary':
          fallbackContent = `• Results-driven professional with expertise in ${prompt.substring(0, 50)}...\n• Proven track record of delivering high-quality solutions and exceeding expectations\n• Strong background in relevant technologies with focus on continuous improvement\n• Passionate about contributing to team success and driving organizational growth`;
          break;
        case 'experience':
          fallbackContent = `• Led key initiatives and projects with measurable impact and positive results\n• Collaborated with cross-functional teams to deliver solutions on time and within budget\n• Implemented best practices and process improvements that increased efficiency\n• Managed stakeholder relationships and communicated effectively across all levels`;
          break;
        case 'skills':
          fallbackContent = 'JavaScript, React, Node.js, Python, SQL, Git, Agile, Problem Solving, Team Collaboration, Communication';
          break;
      }
      
      onGenerate(fallbackContent);
      setIsOpen(false);
      setPrompt('');
      
      toast({
        title: "Content Generated",
        description: "Generated content using fallback method. You can edit it as needed.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-2 text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            {getFieldTitle()}
          </DialogTitle>
          <DialogDescription>
            {getFieldDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ai-prompt">Your Input</Label>
            <Textarea
              id="ai-prompt"
              placeholder={getPlaceholder()}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={generateContent}
            disabled={isGenerating || !prompt.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIFieldHelper;
