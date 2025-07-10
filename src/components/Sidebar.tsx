
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Briefcase, 
  Calendar, 
  Building2, 
  Settings,
  Home,
  Sparkles,
  FileText,
  Target
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Briefcase, label: 'Applications', path: '/applications' },
  { icon: Target, label: 'Job Tracker', path: '/job-tracker' },
  { icon: FileText, label: 'Resume AI', path: '/resume' },
  { icon: Building2, label: 'Companies', path: '/companies' },
  { icon: Calendar, label: 'Interviews', path: '/interviews' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl shadow-xl border-r border-gray-200/50">
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">StudentOS</h1>
            <p className="text-sm text-gray-500 font-medium">Career Growth Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="px-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3.5 rounded-xl mb-1 transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-colors duration-200`} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-8 left-6 right-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <p className="text-sm text-blue-100 mb-4">Get personalized career insights and application tips</p>
          <button className="w-full bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
