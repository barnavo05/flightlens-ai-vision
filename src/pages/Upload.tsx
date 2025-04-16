import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Plane, Upload as UploadIcon, Camera, X, Loader2, ArrowLeft, Keyboard, Radar, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { detectDrone, saveDetectionResult } from "@/services/droneDetection";
import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";

const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<"visual" | "rf" | "combined">("combined");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setImage(e.target.result);
        toast.success('Image loaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDetection = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);
    
    try {
      const result = await detectDrone(image);
      
      saveDetectionResult(result);
      
      sessionStorage.setItem('currentResult', JSON.stringify(result));
      
      setTimeout(() => {
        toast.success('Drone successfully detected!');
        navigate('/results');
      }, 500);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
      setIsProcessing(false);
    }
  };
  
  const resetUpload = () => {
    setImage(null);
    setUploadProgress(0);
  };

  useKeyboardShortcut((e) => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  }, { targetKey: 'u' });

  useKeyboardShortcut((e) => {
    if (image && !isProcessing) {
      handleDetection();
    }
  }, { targetKey: 'Enter' });

  useKeyboardShortcut((e) => {
    if (image && !isProcessing) {
      resetUpload();
    }
  }, { targetKey: 'Escape' });

  useKeyboardShortcut((e) => {
    setShowShortcuts(prevState => !prevState);
  }, { targetKey: '?' });

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Drone Detection System</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => setShowShortcuts(!showShortcuts)}
            >
              <Keyboard size={16} className="mr-1" />
              Shortcuts
            </Button>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {showShortcuts && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-4 rounded-xl mb-6"
          >
            <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Upload image</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">U</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Start detection</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Reset/cancel</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Show/hide shortcuts</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>
              </div>
            </div>
          </motion.div>
        )}

        <div className="glass-card p-8 rounded-xl">
          <Tabs defaultValue="combined" className="mb-6" onValueChange={(value) => setDetectionMethod(value as any)}>
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <Camera size={16} />
                Visual
              </TabsTrigger>
              <TabsTrigger value="rf" className="flex items-center gap-2">
                <Radio size={16} />
                RF Analysis
              </TabsTrigger>
              <TabsTrigger value="combined" className="flex items-center gap-2">
                <Radar size={16} />
                Combined
              </TabsTrigger>
            </TabsList>
            <TabsContent value="visual" className="pt-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                <p>Visual detection uses AI-powered image recognition to identify drones.</p>
                <p className="mt-2">Best for clear line of sight and good lighting conditions.</p>
              </div>
            </TabsContent>
            <TabsContent value="rf" className="pt-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                <p>Radio Frequency analysis detects drone communication signals.</p>
                <p className="mt-2">Works beyond visual range and in all weather conditions.</p>
              </div>
            </TabsContent>
            <TabsContent value="combined" className="pt-4">
              <div className="text-center text-sm text-muted-foreground mb-6">
                <p>Combined method uses multiple detection technologies simultaneously.</p>
                <p className="mt-2">Provides highest accuracy but requires more processing time.</p>
              </div>
            </TabsContent>
          </Tabs>

          {!image ? (
            <div
              className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-primary/30'} rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragging ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              >
                <Plane size={40} className="text-primary" />
              </motion.div>
              <h2 className="text-xl font-semibold">Upload drone detection data</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Drag and drop an image of a suspected drone, or click the button below to browse your files
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <UploadIcon size={16} />
                  Select File
                </Button>
                <Button variant="outline" className="gap-2">
                  <Camera size={16} />
                  Take Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-[350px] object-contain rounded-lg"
                />
                <button 
                  onClick={resetUpload}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80"
                >
                  <X size={18} />
                </button>
              </div>
              
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <p>Processing detection using {detectionMethod} method...</p>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button onClick={handleDetection} className="flex-1">
                    Start Drone Detection
                  </Button>
                  <Button variant="outline" onClick={resetUpload}>
                    Choose Different Image
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8 glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Detection System Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Radar className="h-4 w-4 text-primary" />
                Radar Detection
              </h3>
              <p className="text-sm text-muted-foreground">
                Detection range up to 10km. Works in all weather conditions
                and provides accurate position, altitude, and speed data.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                RF Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Identifies drone controller signals and communication protocols
                for early detection, even before visual confirmation.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Visual Recognition
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered image analysis for drone type identification
                with thermal and optical camera support.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" />
                Multi-Drone Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Capable of simultaneously tracking multiple drones and
                distinguishing between authorized and unauthorized UAVs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Upload;
