
import { Routes, Route, Navigate } from "react-router-dom";
import ResumeDashboard from "@/features/resume-ai/pages/Dashboard";
import CreateResume from "@/pages/CreateResume";
import EditResume from "@/pages/EditResume";
import ResumePreview from "@/pages/ResumePreview";
import TemplateManager from "@/pages/TemplateManager";
import JobTracker from "@/pages/JobTracker";
import Index from "@/pages/Index";

const ResumeAIIntegration = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<ResumeDashboard />} />
      <Route path="create" element={<CreateResume />} />
      <Route path="edit/:id" element={<EditResume />} />
      <Route path="preview/:id" element={<ResumePreview />} />
      <Route path="templates" element={<TemplateManager />} />
      <Route path="job-tracker" element={<JobTracker />} />
      <Route path="landing" element={<Index />} />
    </Routes>
  );
};

export default ResumeAIIntegration;
