
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlaneTakeoff, Upload as UploadIcon, Camera, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";

const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = () => {
    if (!image) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          toast.success('Image uploaded successfully!');
          // Navigate to results page in a real app
          window.location.href = '/results';
        }, 500);
      }
    }, 150);
  };
  
  const resetUpload = () => {
    setImage(null);
    setUploadProgress(0);
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Upload Aircraft Image</h1>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

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
