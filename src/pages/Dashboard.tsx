
import { motion } from "framer-motion";
import { Upload, Image, MapPin, Clock, PlaneTakeoff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

// Mock recent detections
const recentDetections = [
  {
    id: 1,
    aircraftName: "Boeing 747-400",
    confidence: 98.5,
    imageUrl: "https://images.unsplash.com/photo-1520437358207-323b43b50729?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    date: "Yesterday"
  },
  {
    id: 2,
    aircraftName: "Airbus A380",
    confidence: 97.2,
    imageUrl: "https://images.unsplash.com/photo-1562593054-14b5857faf1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    date: "3 days ago"
  },
  {
    id: 3,
    aircraftName: "DJI Mavic Air 2",
    confidence: 94.8,
    imageUrl: "https://images.unsplash.com/photo-1595252129934-327fcda123fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    date: "Last week"
  }
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to FlightLens AI</p>
            </div>
            <Button asChild>
              <Link to="/upload" className="flex items-center gap-2">
                <Upload size={16} />
                Upload New Image
              </Link>
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              icon={<Image className="text-blue-400" />} 
              title="Total Scans" 
              value="12" 
              description="Images analyzed"
            />
            <StatCard 
              icon={<PlaneTakeoff className="text-green-400" />} 
              title="Aircraft Identified"
              value="8"
              description="Different models detected"
            />
            <StatCard 
              icon={<MapPin className="text-purple-400" />}
              title="Flight Paths"
              value="3"
              description="Locations detected"
            />
          </div>
          
          {/* Recent Detections */}
          <h2 className="text-xl font-semibold mb-4">Recent Detections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {recentDetections.map((detection) => (
              <Card key={detection.id} className="glass-panel">
                <CardHeader className="p-4">
                  <div className="relative h-32 rounded-md overflow-hidden mb-2">
                    <img 
                      src={detection.imageUrl} 
                      alt={detection.aircraftName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{detection.aircraftName}</CardTitle>
                  <CardDescription className="flex justify-between">
                    <span>Confidence: {detection.confidence}%</span>
                    <span className="flex items-center gap-1 text-xs">
                      <Clock size={12} />
                      {detection.date}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="glass-card p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Unlock Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Upload 5 more images to access the full analytics dashboard with detailed insights.
              </p>
            </div>
            <Button>Upload More Images</Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

const StatCard = ({ icon, title, value, description }: StatCardProps) => (
  <Card className="glass-panel">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
