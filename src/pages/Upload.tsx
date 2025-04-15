
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { PlaneTakeoff, Upload as UploadIcon, Camera, X, Loader2, ArrowLeft, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import { analyzeAircraftImage, saveRecognitionResult } from "@/services/aircraftRecognition";
import useKeyboardShortcut from "@/hooks/useKeyboardShortcut";

const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
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
    // Check if file is an image
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
  
  const handleUpload = async () => {
    if (!image) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);
    
    try {
      // Call the recognition service
      const result = await analyzeAircraftImage(image);
      
      // Save result to local storage
      saveRecognitionResult(result);
      
      // Store the current result for the results page
      sessionStorage.setItem('currentResult', JSON.stringify(result));
      
      // Navigate to results page
      setTimeout(() => {
        toast.success('Aircraft successfully identified!');
        navigate('/results');
      }, 500);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image');
      setIsUploading(false);
    }
  };
  
  const resetUpload = () => {
    setImage(null);
    setUploadProgress(0);
  };

  // Keyboard shortcuts
  useKeyboardShortcut((e) => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, { targetKey: 'u' });

  useKeyboardShortcut((e) => {
    if (image && !isUploading) {
      handleUpload();
    }
  }, { targetKey: 'Enter' });

  useKeyboardShortcut((e) => {
    if (image && !isUploading) {
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
          <h1 className="text-2xl font-bold">Upload Aircraft Image</h1>
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
                <span>Analyze image</span>
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
                <UploadIcon size={40} className="text-primary" />
              </motion.div>
              <h2 className="text-xl font-semibold">Drop your image here</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Drag and drop an aircraft image, or click the button below to browse your files
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
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <p>Processing image...</p>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button onClick={handleUpload} className="flex-1">
                    Identify Aircraft
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
          <h2 className="text-lg font-semibold mb-4">Tips for Best Results</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2 items-start">
              <span className="text-primary font-medium">✓</span>
              Use clear, well-lit images of the aircraft
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-primary font-medium">✓</span>
              Side profiles or 45° angles work best for identification
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-primary font-medium">✓</span>
              Make sure the aircraft is the main subject in the image
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-primary font-medium">✓</span>
              If possible, include images with visible aircraft markings
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default Upload;
