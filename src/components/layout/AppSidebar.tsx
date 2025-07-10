
import { Home, FileText, Briefcase, Target, Settings, BarChart3, GraduationCap, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Resume AI", url: "/resume", icon: FileText },
  { title: "Job Tracker", url: "/job-tracker", icon: Briefcase },
  { title: "JobHunter", url: "/job-hunter", icon: Target },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md font-semibold" 
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200";
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} border-r border-slate-200 bg-white`} collapsible="icon">
      <SidebarContent className="bg-white">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-slate-900">StudentOS</h2>
                <p className="text-xs text-slate-500 font-medium">By Students, For Students</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-semibold text-xs uppercase tracking-wider px-6 py-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      className={`${getNavClass(item.url)} flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${item.url === "/job-hunter" ? "opacity-50 cursor-not-allowed" : ""}`}
                      end={item.url === "/"}
                      onClick={(e) => {
                        if (item.url === "/job-hunter") {
                          e.preventDefault();
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">
                          {item.title}
                          {item.url === "/job-hunter" && (
                            <span className="text-xs text-slate-400 ml-1">(Coming Soon)</span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Assistant Card */}
        {!isCollapsed && (
          <div className="mt-auto p-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-sm text-slate-900">AI Assistant</h3>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Get personalized academic and career guidance powered by AI
              </p>
              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm">
                Ask AI
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <UserButton 
              afterSignOutUrl="/landing"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
            {!isCollapsed && (
              <div className="text-sm">
                <div className="font-semibold text-slate-900">Your Profile</div>
                <div className="text-slate-500 text-xs">Manage account & settings</div>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
