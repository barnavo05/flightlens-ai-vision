
import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlaneTakeoff, Home, Upload, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BackgroundEffect from "@/components/BackgroundEffect";
import { getCurrentUser, logout, isAuthenticated } from "@/services/authService";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  const user = getCurrentUser();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error("Please login to access this page");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userInitials = user ? user.name.substring(0, 2).toUpperCase() : "FL";

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffect />
      
      <header className="w-full py-4 px-6 glass-panel flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-3">
          <PlaneTakeoff size={28} className="text-primary" />
          <h1 className="text-xl font-bold text-gradient">FlightLens AI</h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}` : undefined} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass-panel h-[calc(100vh-73px)] w-64 sticky top-[73px] hidden md:block border-r border-border/40"
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

        {/* Main content */}
        <main className="flex-1">
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
