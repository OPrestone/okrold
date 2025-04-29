import { Link, useLocation } from "wouter";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { BarChart3, BookOpen, CalendarCheck, Flag, Home, LogOut, Rocket, Settings, Upload, Users, UserCog, UsersRound, PieChart, Compass, DollarSign, Target, FileEdit } from "lucide-react";
import { Separator } from "./separator";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [location] = useLocation();

  const menuItems: SidebarItem[] = [
    {
      icon: <Rocket className="h-5 w-5" />,
      label: "Quick Get Started Guide",
      href: "/quick-start",
    },
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      href: "/",
    },
    {
      icon: <Compass className="h-5 w-5" />,
      label: "Mission",
      href: "/mission",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Dashboards",
      href: "/dashboards",
    },
    {
      icon: <Flag className="h-5 w-5" />,
      label: "Company Objectives",
      href: "/company-objectives",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "My OKRs",
      href: "/my-okrs",
    },
    {
      icon: <FileEdit className="h-5 w-5" />,
      label: "OKR Drafts",
      href: "/drafts",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Teams",
      href: "/teams",
    },
    {
      icon: <UserCog className="h-5 w-5" />,
      label: "Users",
      href: "/users",
    },
    {
      icon: <UsersRound className="h-5 w-5" />,
      label: "1:1 Meetings",
      href: "/one-on-one",
    },
    {
      icon: <CalendarCheck className="h-5 w-5" />,
      label: "Check-ins",
      href: "/check-ins",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>,
      label: "Strategy Map",
      href: "/strategy-map",
    },
    {
      icon: <PieChart className="h-5 w-5" />,
      label: "Reporting",
      href: "/reporting",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Resources",
      href: "/resources",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Import Financial Data",
      href: "/import-financial",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Configure",
      href: "/configure",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col",
        "transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0",
        className
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-neutral-900">OKR System</span>
        </Link>
        <button onClick={toggleSidebar} className="md:hidden text-neutral-500 hover:text-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="mb-6">
          <Link 
            href="/quick-start"
            className={cn(
              "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
              location === "/quick-start" 
                ? "bg-primary-50 text-primary-700" 
                : "text-neutral-700 hover:bg-neutral-100"
            )}
          >
            <Rocket className={cn(
              "mr-3 text-lg",
              location === "/quick-start" ? "text-primary-500" : "text-neutral-500"
            )} />
            <span>Quick Get Started Guide</span>
          </Link>
        </div>

        <div className="space-y-1">
          {menuItems.slice(1).map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
                location === item.href 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <div className={cn(
                "mr-3 text-lg",
                location === item.href ? "text-primary-500" : "text-neutral-500"
              )}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-xs font-medium text-neutral-600">AM</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-700">Alex Morgan</p>
            <p className="text-xs text-neutral-500">Product Manager</p>
          </div>
          <button className="ml-auto text-neutral-400 hover:text-neutral-500">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
