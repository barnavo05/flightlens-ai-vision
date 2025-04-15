
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Info, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";

const Results = () => {
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get result from sessionStorage
    const result = sessionStorage.getItem('currentResult');
    if (result) {
      setDetectionResult(JSON.parse(result));
    } else {
      toast.error("No recognition result found");
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
                <h1 className="text-2xl font-bold">Aircraft Detection Results</h1>
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
                    New Scan
                  </Link>
                </Button>
              </div>
            </div>

            {/* Results Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="glass-card rounded-xl p-6 order-2 lg:order-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gradient-primary">{detectionResult.aircraftName}</h2>
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
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="flightPath">Flight Path Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="specifications" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      {Object.entries(detectionResult.specifications).map(([key, value]) => (
                        <div key={key} className="py-2 border-b border-border/30 last:border-0">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="flightPath">
                    <div className="space-y-4">
                      <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Flight Path Analysis</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Based on image metadata and visual analysis, we've estimated the following:
                        </p>
                        
                        <div className="space-y-3">
                          {Object.entries(detectionResult.flightPathData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="glass-panel p-4 rounded-lg flex items-center gap-3">
                        <Info size={18} className="text-primary" />
                        <p className="text-sm">
                          Flight path data is estimated and may not be 100% accurate. For precise information, 
                          refer to official flight records.
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Image</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <img 
                        src={detectionResult.uploadedImage} 
                        alt="Uploaded aircraft" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Reference Image</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <img 
                        src={detectionResult.referenceImage} 
                        alt="Reference aircraft" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Similar Models */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Similar Aircraft Models</h2>
              <div className="glass-panel p-6 rounded-xl">
                <div className="space-y-4">
                  {detectionResult.similarModels.map((model: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{model.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={model.similarity} className="w-24 h-2" />
                        <span className="text-sm">{model.similarity}%</span>
                      </div>
                    </div>
                  ))}
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
