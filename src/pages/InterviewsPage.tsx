
import { useState } from 'react';
import { Calendar, Clock, Video, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InterviewsPage = () => {
  const upcomingInterviews = [
    {
      id: 1,
      company: 'Google',
      position: 'Software Engineer',
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Video Call',
      status: 'Scheduled',
      interviewer: 'John Smith'
    },
    {
      id: 2,
      company: 'Microsoft',
      position: 'Product Manager',
      date: '2024-01-18',
      time: '10:00 AM',
      type: 'On-site',
      status: 'Confirmed',
      interviewer: 'Sarah Johnson'
    },
  ];

  const pastInterviews = [
    {
      id: 3,
      company: 'Apple',
      position: 'UX Designer',
      date: '2024-01-10',
      time: '3:00 PM',
      type: 'Video Call',
      status: 'Completed',
      result: 'Passed to next round'
    },
    {
      id: 4,
      company: 'Amazon',
      position: 'Data Scientist',
      date: '2024-01-08',
      time: '1:00 PM',
      type: 'Phone',
      status: 'Completed',
      result: 'Waiting for feedback'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <Video className="w-4 h-4" />;
      case 'Phone': return <Clock className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Interviews</h1>
        <Button>Schedule Interview</Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{interview.company}</CardTitle>
                  <CardDescription>{interview.position}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {interview.date} at {interview.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {getTypeIcon(interview.type)}
                    <span className="ml-2">{interview.type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Interviewer: {interview.interviewer}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{interview.company}</CardTitle>
                  <CardDescription>{interview.position}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {interview.date} at {interview.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    {getTypeIcon(interview.type)}
                    <span className="ml-2">{interview.type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Result: {interview.result}
                  </div>
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewsPage;
