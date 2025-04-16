
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Info, Share2, Download, AlertTriangle, Radar, Radio, Camera, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { DroneDetectionResult, DetectionMethod } from "@/services/droneDetection";

const Results = () => {
  const [detectionResult, setDetectionResult] = useState<DroneDetectionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get result from sessionStorage
    const result = sessionStorage.getItem('currentResult');
    if (result) {
      setDetectionResult(JSON.parse(result));
    } else {
      toast.error("No detection result found");
      navigate("/upload");
    }
    setLoading(false);
  }, [navigate]);
  
  const handleShare = () => {
    // Mock share functionality
    toast.success("Sharing link copied to clipboard!");
    navigator.clipboard.writeText(window.location.href);
  };
  
  const handleDownload = () => {
    // Mock download functionality
    toast.success("Report downloaded!");
  };
  
  const getThreatLevelColor = (level: string) => {
    switch(level.toLowerCase()) {
      case "high": return "bg-red-500 hover:bg-red-600";
      case "medium": return "bg-amber-500 hover:bg-amber-600";
      case "low": return "bg-green-500 hover:bg-green-600";
      default: return "bg-blue-500 hover:bg-blue-600";
    }
  };
  
  if (loading || !detectionResult) {
    return (
      <AppLayout>
        <div className="container mx-auto py-20 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-96 bg-muted rounded-md"></div>
            <div className="mt-8 h-64 w-full max-w-2xl bg-muted rounded-xl"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Drone Detection Results</h1>
                <Badge 
                  className={`${getThreatLevelColor(detectionResult.threatLevel)} ml-2`}
                >
                  {detectionResult.threatLevel} Threat
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
                  <Share2 size={16} />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload}>
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/upload">
                    <Upload size={16} className="mr-2" />
                    New Detection
                  </Link>
                </Button>
              </div>
            </div>

            {/* Detection Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="glass-card rounded-xl p-6 order-2 lg:order-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gradient-primary">{detectionResult.droneName}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <div className="flex items-center gap-2">
                      <Progress value={detectionResult.confidence} className="w-24 h-2" />
                      <span className="text-sm font-medium">{detectionResult.confidence}%</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="specifications">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="specifications">Drone Specifications</TabsTrigger>
                    <TabsTrigger value="analysis">Detection Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="specifications" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      {Object.entries(detectionResult.specifications).map(([key, value]) => (
                        <div key={key} className="py-2 border-b border-border/30 last:border-0">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analysis">
                    <div className="space-y-4">
                      <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Detection Analysis</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Based on sensor data and AI analysis, we've detected the following:
                        </p>
                        
                        <div className="space-y-3">
                          {Object.entries(detectionResult.analysisData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border/30">
                          <p className="font-medium">Detection Timestamp</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(detectionResult.detectionTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="glass-panel p-4 rounded-lg flex items-center gap-3">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <p className="text-sm">
                          Detection analysis is based on current sensor data. Drone capabilities
                          and behavior may change.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <motion.div 
                className="glass-card p-6 rounded-xl order-1 lg:order-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Detection Image</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <img 
                        src={detectionResult.detectedImage} 
                        alt="Detected drone" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Reference Image</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <img 
                        src={detectionResult.referenceImage} 
                        alt="Reference drone" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Detection Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Detection Methods</h2>
              <div className="glass-panel p-6 rounded-xl">
                <div className="space-y-4">
                  {detectionResult.detectionMethods.map((method: DetectionMethod, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {method.name.toLowerCase().includes("rf") && <Radio size={18} className="text-primary" />}
                        {method.name.toLowerCase().includes("visual") && <Camera size={18} className="text-primary" />}
                        {method.name.toLowerCase().includes("radar") && <Radar size={18} className="text-primary" />}
                        {method.name.toLowerCase().includes("acoustic") && <Shield size={18} className="text-primary" />}
                        {!method.name.toLowerCase().includes("rf") && !method.name.toLowerCase().includes("visual") && 
                         !method.name.toLowerCase().includes("radar") && !method.name.toLowerCase().includes("acoustic") && 
                         <Info size={18} className="text-primary" />}
                        <span className="font-medium">{method.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={method.accuracy} className="w-24 h-2" />
                        <span className="text-sm">{method.accuracy}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations Section */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Recommended Actions
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {detectionResult.threatLevel.toLowerCase() === "low" && (
                      <>
                        <li className="flex gap-2 items-start">
                          <span className="text-green-500">✓</span>
                          Monitor drone activity but no immediate action required
                        </li>
                        <li className="flex gap-2 items-start">
                          <span className="text-green-500">✓</span>
                          Log detection in system for historical tracking
                        </li>
                      </>
                    )}
                    {detectionResult.threatLevel.toLowerCase() === "medium" && (
                      <>
                        <li className="flex gap-2 items-start">
                          <span className="text-amber-500">!</span>
                          Continue tracking and assess flight pattern
                        </li>
                        <li className="flex gap-2 items-start">
                          <span className="text-amber-500">!</span>
                          Notify security personnel of potential restricted zone entry
                        </li>
                      </>
                    )}
                    {detectionResult.threatLevel.toLowerCase() === "high" && (
                      <>
                        <li className="flex gap-2 items-start">
                          <span className="text-red-500">!</span>
                          Immediate alert to security team required
                        </li>
                        <li className="flex gap-2 items-start">
                          <span className="text-red-500">!</span>
                          Initiate countermeasures protocol if authorized
                        </li>
                      </>
                    )}
                    <li className="flex gap-2 items-start">
                      <span className="text-primary">i</span>
                      Archive detection data for further analysis
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Results;
