
import React, { useState, useEffect } from 'react';
import { StatsCards } from './StatsCards';
import { RecentApplications } from './RecentApplications';
import { ApplicationChart } from './ApplicationChart';
import { UpcomingInterviews } from './UpcomingInterviews';
import { BookOpen, TrendingUp, Target, FileText, Briefcase, ArrowRight, Zap, Plus, Calendar, BarChart3, GraduationCap, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  description?: string;
  status: 'Applied' | 'Interview Scheduled' | 'Under Review' | 'Rejected' | 'Offer';
  appliedDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BACKEND_URL = 'https://job-hunter-backend-sigma.vercel.app';

export const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/applications`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        const savedApplications = localStorage.getItem('jobApplications');
        if (savedApplications) {
          try {
            const parsed = JSON.parse(savedApplications);
            setApplications(Array.isArray(parsed) ? parsed : []);
          } catch (error) {
            console.error('Error loading from localStorage:', error);
            setApplications([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        try {
          const parsed = JSON.parse(savedApplications);
          setApplications(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Error loading from localStorage:', error);
          setApplications([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const userName = user?.firstName || user?.fullName || 'Student';

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <GraduationCap className="w-8 h-8 text-yellow-300" />
                <h1 className="text-4xl font-bold">
                  Welcome to StudentOS, {userName}! 🎓
                </h1>
              </div>
              <p className="text-xl text-blue-100 max-w-3xl leading-relaxed">
                Your all-in-one platform for academic excellence and career success. Built by students, for students.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              <Users className="w-5 h-5 text-green-300" />
              <span className="font-semibold">By Students, For Students</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">AI-Powered Tools</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/20 px-4 py-2 rounded-xl backdrop-blur-sm">
              <Clock className="w-5 h-5 text-emerald-300" />
              <span className="font-semibold">Academic & Professional Growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Applications Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-blue-600" />
          Integrated Applications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:scale-105"
                onClick={() => navigate('/resume')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <CardTitle className="text-lg">Resume AI</CardTitle>
              <CardDescription>AI-powered resume builder with templates</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-emerald-50 to-teal-100 hover:scale-105"
                onClick={() => navigate('/job-tracker')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <CardTitle className="text-lg">Job Tracker</CardTitle>
              <CardDescription>Complete job application management</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-pink-100 hover:scale-105"
                onClick={() => navigate('/interviews')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <CardTitle className="text-lg">Interview Prep</CardTitle>
              <CardDescription>Schedule and prepare for interviews</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-red-100 hover:scale-105"
                onClick={() => navigate('/analytics')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>Track your academic & career progress</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/job-tracker')}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Job Application
        </Button>
        
        <Button 
          onClick={() => navigate('/resume')}
          variant="outline"
          size="lg"
          className="px-8 py-4 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
        >
          <FileText className="w-5 h-5 mr-2" />
          Create Resume
        </Button>
      </div>
      
      <StatsCards applications={applications} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ApplicationChart />
        <UpcomingInterviews applications={applications} />
      </div>
      
      <RecentApplications />
    </div>
  );
};
