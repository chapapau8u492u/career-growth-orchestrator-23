
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Briefcase, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
}

const CareerOSDashboard = () => {
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      const applications = JSON.parse(savedApplications);
      setRecentApplications(applications.slice(0, 3));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalApplications: recentApplications.length,
    pendingApplications: recentApplications.filter(app => app.status === 'applied').length
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Dashboard</h1>
        <p className="text-gray-600">Your unified platform for career development</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-purple-600">{stats.totalApplications}</CardTitle>
            <CardDescription>Total Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</CardTitle>
            <CardDescription>Pending Applications</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-600">5</CardTitle>
            <CardDescription>Active Goals</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">3</CardTitle>
            <CardDescription>Skills Learned</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5 text-blue-600" />
                  Create Resume
                </CardTitle>
                <CardDescription>Build a professional resume with AI assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/resume/create">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-purple-600" />
                  Track Applications
                </CardTitle>
                <CardDescription>Monitor your job application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/jobs">
                  <Button className="w-full" variant="outline">View Tracker</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Applications Sidebar */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="/jobs">
              <Button variant="outline" className="text-sm">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          
          {recentApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Briefcase className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-4">No applications yet</p>
                <Link to="/jobs">
                  <Button variant="outline" className="text-sm">
                    Start Tracking Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{app.position}</h4>
                        <p className="text-xs text-gray-600 truncate">{app.company}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerOSDashboard;
