
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Plus, Building, Calendar, MapPin, DollarSign } from "lucide-react";

const JobsPage = () => {
  const jobApplications = [
    {
      id: 1,
      company: "TechCorp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      status: "Interview",
      appliedDate: "2024-01-15",
      stage: "Technical Round"
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Developer",
      location: "Remote",
      salary: "$90k - $110k",
      status: "Applied",
      appliedDate: "2024-01-12",
      stage: "Application Review"
    },
    {
      id: 3,
      company: "Big Tech Inc",
      position: "Frontend Engineer",
      location: "Seattle, WA",
      salary: "$130k - $160k",
      status: "Rejected",
      appliedDate: "2024-01-08",
      stage: "Final Decision"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview": return "bg-blue-100 text-blue-800";
      case "Applied": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Offer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Job Tracker</h2>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-teal-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Integration Message */}
      <Card className="border-dashed border-2 border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-green-800">Job Tracker Integration Ready</CardTitle>
          <CardDescription className="text-green-600">
            Your Job Tracker app can be mounted here. Place your existing job tracking components in this section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-green-700 space-y-2">
            <p>• Import your Job Tracker components into this page</p>
            <p>• Replace this placeholder with your existing job tracker</p>
            <p>• Database models and API endpoints can be shared</p>
          </div>
        </CardContent>
      </Card>

      {/* Job Applications List */}
      <div className="space-y-4">
        {jobApplications.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.position}</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-700">
                      {job.company}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Applied {job.appliedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{job.stage}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="outline">Update Status</Button>
                <Button size="sm" variant="outline">Add Note</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
