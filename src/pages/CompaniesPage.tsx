
import { useState } from 'react';
import { Search, Building2, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const companies = [
    { id: 1, name: 'Google', industry: 'Technology', location: 'Mountain View, CA', employees: '100,000+', status: 'Applied' },
    { id: 2, name: 'Microsoft', industry: 'Technology', location: 'Redmond, WA', employees: '220,000+', status: 'Interested' },
    { id: 3, name: 'Apple', industry: 'Technology', location: 'Cupertino, CA', employees: '164,000+', status: 'Researching' },
    { id: 4, name: 'Amazon', industry: 'E-commerce', location: 'Seattle, WA', employees: '1,500,000+', status: 'Applied' },
    { id: 5, name: 'Meta', industry: 'Social Media', location: 'Menlo Park, CA', employees: '87,000+', status: 'Interview' },
    { id: 6, name: 'Netflix', industry: 'Entertainment', location: 'Los Gatos, CA', employees: '12,000+', status: 'Interested' },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-green-100 text-green-800';
      case 'Interested': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>Add Company</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              </div>
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <CardDescription>{company.industry}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {company.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {company.employees} employees
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Jobs
                </Button>
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
