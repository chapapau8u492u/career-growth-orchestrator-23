import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./components/Dashboard";
import JobTrackerDashboard from "./pages/JobTrackerDashboard";
import JobTracker from "./pages/JobTracker";
import ResumeAIIntegration from "./components/ResumeAIIntegration";
import LandingPage from "./pages/LandingPage";
import TemplateManager from "./pages/TemplateManager";
import TemplateManagementPage from "./pages/TemplateManagementPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <>
              <SignedOut>
                <LandingPage />
              </SignedOut>
              <SignedIn>
                <SidebarProvider>
                  <Routes>
                    <Route path="/" element={<AppLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      
                      {/* Job Tracker Routes - All job-related functionality */}
                      <Route path="job-tracker" element={<JobTrackerDashboard />} />
                      <Route path="job-tracker/add" element={<JobTracker />} />
                      <Route path="job-tracker/interviews" element={<div>Job Tracker Interviews</div>} />
                      
                      {/* Resume AI Routes - All resume-related functionality */}
                      <Route path="resume/*" element={<ResumeAIIntegration />} />
                      <Route path="resume/templates" element={<TemplateManager />} />
                      
                      {/* Template Management Route - URL only access */}
                      <Route path="template-management" element={<TemplateManagementPage />} />
                      
                      {/* Other Routes */}
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      
                      {/* Coming Soon Route */}
                      <Route path="job-hunter" element={<div className="flex items-center justify-center h-64"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">JobHunter Coming Soon</h2><p className="text-gray-600">This feature will be available soon!</p></div></div>} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SidebarProvider>
              </SignedIn>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
