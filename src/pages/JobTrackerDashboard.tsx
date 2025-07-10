import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Calendar, MoreHorizontal, Eye, Edit3, Trash2, ExternalLink, Search, Grid3X3, List, MapPin, Plus, Target, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from '@/components/StatsCards';

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
}

const statusConfig = {
  'Applied': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📋' },
  'Interview Scheduled': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '📅' },
  'Under Review': { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '👀' },
  'Rejected': { color: 'bg-red-50 text-red-700 border-red-200', icon: '❌' },
  'Offer': { color: 'bg-green-50 text-green-700 border-green-200', icon: '✅' }
};

const BACKEND_URL = 'https://job-hunter-backend-sigma.vercel.app';

const formSchema = z.object({
  company: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  jobUrl: z.string().url("Please enter a valid URL").optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['Applied', 'Interview Scheduled', 'Under Review', 'Rejected', 'Offer']),
  appliedDate: z.date(),
  notes: z.string().optional(),
})

// Type guard function to validate if an object is a valid JobApplication
const isValidJobApplication = (obj: any): obj is JobApplication => {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.company === 'string' && obj.company.length > 0 &&
         typeof obj.position === 'string' && obj.position.length > 0 &&
         typeof obj.appliedDate === 'string' &&
         ['Applied', 'Interview Scheduled', 'Under Review', 'Rejected', 'Offer'].includes(obj.status);
};

// Filter function to ensure only valid applications are processed
const filterValidApplications = (applications: any[]): JobApplication[] => {
  return applications.filter(isValidJobApplication);
};

const JobTrackerDashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      position: "",
      jobUrl: "",
      location: "",
      salary: "",
      description: "",
      status: 'Applied',
      appliedDate: new Date(),
      notes: "",
    },
  })

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/applications`);
      if (response.ok) {
        const data = await response.json();
        const validApplications = filterValidApplications(data.applications || []);
        setApplications(validApplications);
      } else {
        throw new Error('Backend not available');
      }
    } catch (error) {
      console.log('Loading from localStorage fallback');
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        try {
          const parsed = JSON.parse(savedApplications);
          const validApplications = filterValidApplications(Array.isArray(parsed) ? parsed : []);
          setApplications(validApplications);
        } catch (error) {
          console.error('Error loading from localStorage:', error);
          setApplications([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addApplication = async (values: z.infer<typeof formSchema>) => {
    try {
      const newApplication = {
        ...values,
        appliedDate: values.appliedDate.toISOString().split('T')[0],
        id: Date.now().toString()
      };
      
      const response = await fetch(`${BACKEND_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApplication),
      });
      
      if (response.ok) {
        loadApplications();
        toast({
          title: "Application Added",
          description: "New application has been added successfully",
        });
      } else {
        throw new Error('Failed to add to backend');
      }
    } catch (error) {
      // Fallback to local storage
      const newApplication = {
        ...values,
        appliedDate: values.appliedDate.toISOString().split('T')[0],
        id: Date.now().toString()
      };
      
      const updatedApplications = [...applications, newApplication];
      const validApplications = filterValidApplications(updatedApplications);
      setApplications(validApplications);
      localStorage.setItem('jobApplications', JSON.stringify(validApplications));
      
      toast({
        title: "Application Added",
        description: "New application added locally",
      });
    } finally {
      setIsDialogOpen(false);
      form.reset();
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/applications/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast({
          title: "Application Deleted",
          description: "Application has been removed successfully",
        });
      } else {
        throw new Error('Failed to delete from backend');
      }
    } catch (error) {
      // Fallback to local deletion
      setApplications(prev => prev.filter(app => app.id !== id));
      const savedApplications = localStorage.getItem('jobApplications');
      if (savedApplications) {
        const parsed = JSON.parse(savedApplications);
        const updated = parsed.filter((app: JobApplication) => app.id !== id);
        localStorage.setItem('jobApplications', JSON.stringify(updated));
      }
      
      toast({
        title: "Application Deleted",
        description: "Application removed locally",
      });
    }
  };

  // Calculate stats
  const totalApplications = applications.length;
  const interviewScheduled = applications.filter(app => app.status === 'Interview Scheduled').length;
  const offersReceived = applications.filter(app => app.status === 'Offer').length;
  const rejected = applications.filter(app => app.status === 'Rejected').length;

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Status' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Application Tracker</h1>
            <p className="text-gray-600">Track your job applications, interviews, and opportunities</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Applications</CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalApplications}</div>
              <p className="text-xs text-blue-600 mt-1">All submitted applications</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Interview Scheduled</CardTitle>
              <Calendar className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{interviewScheduled}</div>
              <p className="text-xs text-yellow-600 mt-1">
                {interviewScheduled > 0 ? `${Math.round((interviewScheduled / totalApplications) * 100)}% success rate` : 'No interviews yet'}
              </p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Offers Received</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{offersReceived}</div>
              <p className="text-xs text-green-600 mt-1">
                {offersReceived > 0 ? 'Congratulations! 🎉' : 'Keep applying!'}
              </p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Rejected</CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{rejected}</div>
              <p className="text-xs text-red-600 mt-1">Learn and improve</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications" className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by company, position, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Status">All Status</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex rounded-lg border border-gray-200">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none border-r"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications Display */}
            {filteredApplications.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredApplications.map((app) => (
                  <Card key={app.id} className={cn(
                    "group hover:shadow-lg transition-all duration-200 border-l-4",
                    highlightId === app.id ? "ring-2 ring-blue-500 shadow-lg" : "",
                    {
                      'border-l-blue-500': app.status === 'Applied',
                      'border-l-yellow-500': app.status === 'Interview Scheduled',
                      'border-l-purple-500': app.status === 'Under Review',
                      'border-l-red-500': app.status === 'Rejected',
                      'border-l-green-500': app.status === 'Offer'
                    }
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                            {app.position}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium text-gray-700 flex items-center mt-1">
                            <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                            {app.company}
                          </CardDescription>
                        </div>
                        <Badge className={cn(
                          "text-xs font-medium",
                          statusConfig[app.status]?.color
                        )}>
                          {statusConfig[app.status]?.icon} {app.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {app.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{app.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Applied {new Date(app.appliedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>

                      {app.salary && (
                        <div className="text-sm text-green-600 font-medium">
                          💰 {app.salary}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {app.jobUrl && (
                              <DropdownMenuItem onClick={() => window.open(app.jobUrl, '_blank')}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Job Posting
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Application
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteApplication(app.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'All Status' 
                    ? 'Try adjusting your search criteria or filters to find applications.' 
                    : 'Start your job search journey by adding your first application. Keep track of all your opportunities in one place.'
                  }
                </p>
                {!searchQuery && statusFilter === 'All Status' && (
                  <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Application
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="interviews" className="space-y-4">
            <div className="text-center py-16 bg-white rounded-lg border">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interview Management</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Advanced interview scheduling and management features are coming soon! 
                For now, update your application status to "Interview Scheduled" to track upcoming interviews.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for Add/Edit Application */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Edit Application" : "Add New Application"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the application details below." : "Fill in the details for your new job application."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addApplication)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Company *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Google, Microsoft" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Position *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Salary Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $80k - $120k" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="jobUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Job URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://company.com/careers/job-posting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Application Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Applied">📋 Applied</SelectItem>
                          <SelectItem value="Interview Scheduled">📅 Interview Scheduled</SelectItem>
                          <SelectItem value="Under Review">👀 Under Review</SelectItem>
                          <SelectItem value="Rejected">❌ Rejected</SelectItem>
                          <SelectItem value="Offer">✅ Offer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appliedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Applied Date</FormLabel>
                      <DatePicker
                        className={cn(
                          "border rounded-md px-3 py-2 w-full",
                          !field.value && "text-muted-foreground"
                        )}
                        onSelect={field.onChange}
                        defaultMonth={field.value}
                        mode="single"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the role and requirements..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes, interview details, contacts, etc..."
                        className="min-h-[60px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {isEditing ? "Update Application" : "Add Application"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobTrackerDashboard;
