
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, Eye, Calendar, Clock, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { getSavedResults } from "@/services/aircraftRecognition";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";

const Dashboard = () => {
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get saved results from local storage
    const results = getSavedResults();
    setRecentScans(results);
    setIsLoading(false);
  }, []);

  const filteredScans = searchQuery 
    ? recentScans.filter(scan => 
        scan.aircraftName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.specifications.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentScans;

  const handleViewScan = (scan: any) => {
    // Store the selected scan in session storage
    sessionStorage.setItem('currentResult', JSON.stringify(scan));
    // Navigate is handled by Link component
  };

  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">View your recent aircraft analyses</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search aircraft..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button asChild>
              <Link to="/upload">
                <Upload size={16} className="mr-2" />
                New Scan
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New scan card */}
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
            className="glass-card p-6 rounded-xl border-dashed border-2 border-primary/40 flex flex-col items-center justify-center text-center h-80"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">New Analysis</h3>
            <p className="text-muted-foreground mb-6">
              Upload a new aircraft image for AI recognition
            </p>
            <Button asChild>
              <Link to="/upload">Start New Scan</Link>
            </Button>
          </motion.div>

          {/* Recent scans */}
          <AnimatePresence>
            {isLoading ? (
              // Loading placeholders
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`placeholder-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-6 rounded-xl h-80 animate-pulse"
                >
                  <div className="h-40 bg-muted/20 rounded-lg mb-4"></div>
                  <div className="h-6 bg-muted/20 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted/20 rounded w-1/2 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-10 bg-muted/20 rounded w-1/3"></div>
                    <div className="h-10 bg-muted/20 rounded w-1/3"></div>
                  </div>
                </motion.div>
              ))
            ) : filteredScans.length === 0 && recentScans.length === 0 ? (
              // No scans yet state
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 rounded-xl col-span-2 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Scans Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Your aircraft scans will appear here once you analyze your first image. Start by uploading an aircraft photo.
                </p>
                <Button asChild>
                  <Link to="/upload">Upload First Image</Link>
                </Button>
              </motion.div>
            ) : filteredScans.length === 0 && searchQuery ? (
              // No search results
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 rounded-xl col-span-2 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-6">
                  No aircraft matched your search query "{searchQuery}". Try a different search term.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </motion.div>
            ) : (
              // Show scan results
              filteredScans.map((scan, index) => (
                <motion.div
                  key={scan.timestamp || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
                  className="glass-card p-6 rounded-xl flex flex-col h-80"
                >
                  <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-black/40">
                    <img 
                      src={scan.uploadedImage} 
                      alt={scan.aircraftName} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 right-3 bg-primary/90 text-white text-xs font-medium py-1 px-2 rounded">
                      {scan.confidence}% Match
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-1">{scan.aircraftName}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{scan.specifications.manufacturer}</p>
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {scan.timestamp ? format(new Date(scan.timestamp), 'MMM d, yyyy') : 'Unknown date'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {scan.timestamp ? format(new Date(scan.timestamp), 'h:mm a') : 'Unknown time'}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-2 mt-2"
                      onClick={() => handleViewScan(scan)}
                      asChild
                    >
                      <Link to="/results">
                        <Eye size={14} />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
