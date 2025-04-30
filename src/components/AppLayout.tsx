
import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlaneTakeoff, Home, Upload, BarChart3, Settings, LogOut, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BackgroundEffect from "@/components/BackgroundEffect";
import { getCurrentUser, signOut, isAuthenticated, isDemoMode } from "@/lib/supabase";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  // Use React Query for caching and better performance
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        if (!isAuth) {
          toast.error("Please login to access this page");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "Failed to sign out");
      return;
    }
    
    toast.success("Successfully signed out");
    navigate("/");
  };

  const userInitials = user?.user_metadata?.name 
    ? user.user_metadata.name.substring(0, 2).toUpperCase() 
    : "FL";
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-panel p-6 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">We couldn't load your profile information.</p>
          <Button onClick={() => navigate("/login")}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffect />
      
      {isDemoMode && (
        <div className="bg-amber-500/90 text-amber-950 py-2 px-6 text-sm text-center flex items-center justify-center gap-2 sticky top-0 z-20">
          <AlertCircle size={16} />
          <p>
            Running in demo mode with placeholder credentials. 
            <a 
              href="https://supabase.com/dashboard/sign-up" 
              target="_blank" 
              rel="noreferrer"
              className="underline ml-1 font-medium hover:text-amber-800"
            >
              Create a free Supabase account
            </a> for full functionality.
          </p>
        </div>
      )}
      
      <header className={cn(
        "w-full py-4 px-6 glass-panel flex items-center justify-between sticky z-10",
        isDemoMode ? "top-8" : "top-0"
      )}>
        <Link to="/" className="flex items-center gap-3">
          <PlaneTakeoff size={28} className="text-primary" />
          <h1 className="text-xl font-bold text-gradient">FlightLens AI</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.user_metadata?.name || user.email}` : undefined} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.user_metadata?.name || user?.email || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        <AnimatePresence>
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "glass-panel w-64 sticky border-r border-border/40 hidden md:block",
              isDemoMode ? "h-[calc(100vh-105px)] top-[105px]" : "h-[calc(100vh-73px)] top-[73px]"
            )}
          >
            <nav className="p-4">
              <ul className="space-y-2">
                <NavItem href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={isActive('/dashboard')} />
                <NavItem href="/upload" icon={<Upload size={18} />} label="Upload" active={isActive('/upload')} />
                <NavItem href="/analytics" icon={<BarChart3 size={18} />} label="Analytics" active={isActive('/analytics')} />
                <NavItem href="/settings" icon={<Settings size={18} />} label="Settings" active={isActive('/settings')} />
              </ul>
            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.aside>
        </AnimatePresence>

        <main className="flex-1 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  return (
    <li>
      <Link
        to={href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          active 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
        )}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
};

export default AppLayout;
