
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeAIIntegration from "../components/ResumeAIIntegration";
import AIResumeGenerator from "../components/AIResumeGenerator";
import { Sparkles, FileText } from "lucide-react";

const ResumePage = () => {
  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Center</h1>
          <p className="text-gray-600">Create, manage, and optimize your resumes with AI assistance</p>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Resume Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Resume Generator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <ResumeAIIntegration />
          </TabsContent>
          
          <TabsContent value="ai-generator" className="space-y-6">
            <div className="flex justify-center">
              <AIResumeGenerator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumePage;
