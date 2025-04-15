
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Info, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";

// Mock data
const detectionResult = {
  aircraftName: "Boeing 747-400",
  confidence: 98.5,
  uploadedImage: "https://images.unsplash.com/photo-1520437358207-323b43b50729?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  referenceImage: "https://images.unsplash.com/photo-1520437358207-323b43b50729?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  specifications: {
    manufacturer: "Boeing Commercial Airplanes",
    type: "Wide-body airliner",
    firstFlight: "April 29, 1988",
    introduced: "February 9, 1989, with Northwest Airlines",
    status: "In service",
    produced: "1988-2009",
    length: "231 ft 10 in (70.7 m)",
    wingspan: "211 ft 5 in (64.4 m)",
    height: "63 ft 8 in (19.4 m)",
    maxSpeed: "Mach 0.855 (570 mph, 920 km/h)",
    range: "7,670 nmi (14,200 km)",
    engine: "4 × General Electric CF6 or Pratt & Whitney PW4000"
  },
  flightPathData: {
    estimatedLocation: "New York JFK International Airport",
    altitude: "10,668m",
    heading: "North-East (45°)"
  },
  similarModels: [
    { name: "Boeing 747-8", similarity: 92 },
    { name: "Boeing 777-300", similarity: 78 },
    { name: "Airbus A380", similarity: 65 }
  ]
};

const Results = () => {
  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
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
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button size="sm">
                <Upload size={16} className="mr-2" />
                New Scan
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
                {detectionResult.similarModels.map((model, index) => (
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
      </div>
    </AppLayout>
  );
};

export default Results;
