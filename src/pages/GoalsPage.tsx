
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, CheckCircle, Circle, Calendar } from "lucide-react";

const GoalsPage = () => {
  const goals = [
    {
      id: 1,
      title: "Land a Software Engineer Role",
      description: "Secure a full-time position at a tech company",
      progress: 75,
      deadline: "2024-03-30",
      category: "Career",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Complete 50 Job Applications",
      description: "Apply to 50 relevant positions this quarter",
      progress: 60,
      deadline: "2024-02-28",
      category: "Applications",
      status: "In Progress"
    },
    {
      id: 3,
      title: "Master React & Node.js",
      description: "Build 3 full-stack projects to showcase skills",
      progress: 100,
      deadline: "2024-01-31",
      category: "Skills",
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Career Goals</h2>
          <p className="text-muted-foreground">Set and track your professional development goals</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goals Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active goals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-muted-foreground">Goals achieved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Across all goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    {goal.status === "Completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{goal.progress}%</div>
                  <div className="text-xs text-muted-foreground">{goal.category}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={goal.progress} className="w-full" />
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {goal.deadline}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Update Progress</Button>
                  <Button size="sm" variant="outline">Edit Goal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
