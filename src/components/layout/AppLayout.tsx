
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@clerk/clerk-react";
import { Bell, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppLayout() {
  const { user } = useUser();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white/90 backdrop-blur-md flex items-center px-6 shadow-sm sticky top-0 z-50">
            <div className="flex items-center flex-1">
              <SidebarTrigger className="mr-4 hover:bg-slate-100 transition-colors" />
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search across StudentOS..."
                    className="pl-10 bg-slate-50/80 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-lg transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.firstName || user?.fullName || 'Student'}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">StudentOS Member</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {(user?.firstName?.[0] || user?.fullName?.[0] || 'S').toUpperCase()}
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
