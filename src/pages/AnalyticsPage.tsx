
import { BarChart3, TrendingUp, Target, Users, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AnalyticsPage = () => {
  const stats = [
    { title: 'Total Applications', value: '24', change: '+12%', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { title: 'Interview Rate', value: '18%', change: '+5%', icon: Users, color: 'from-green-500 to-green-600' },
    { title: 'Response Rate', value: '42%', change: '+8%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { title: 'Applications This Week', value: '6', change: '+3', icon: Calendar, color: 'from-orange-500 to-orange-600' },
  ];

  const applicationsByStatus = [
    { status: 'Applied', count: 12, percentage: 50 },
    { status: 'Interview', count: 4, percentage: 17 },
    { status: 'Under Review', count: 6, percentage: 25 },
    { status: 'Rejected', count: 2, percentage: 8 },
  ];

  const topCompanies = [
    { name: 'Google', applications: 3, interviews: 1 },
    { name: 'Microsoft', applications: 2, interviews: 1 },
    { name: 'Apple', applications: 2, interviews: 0 },
    { name: 'Amazon', applications: 1, interviews: 1 },
    { name: 'Meta', applications: 1, interviews: 0 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h1>
        <p className="text-gray-600">Track your job search progress and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Application Status
            </CardTitle>
            <CardDescription>
              Breakdown of your application statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {applicationsByStatus.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-gray-600">{item.count} applications ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Companies
            </CardTitle>
            <CardDescription>
              Companies you've applied to most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-600">
                      {company.applications} applications • {company.interviews} interviews
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {company.interviews > 0 ? Math.round((company.interviews / company.applications) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">interview rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Progress
          </CardTitle>
          <CardDescription>
            Your job search activity over the past months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-center space-x-4">
            <div className="text-center text-gray-500">
              <div className="text-sm mb-2">Chart visualization would go here</div>
              <div className="text-xs">Integration with charting library needed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
