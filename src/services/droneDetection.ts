
import { toast } from "sonner";

// Mock drone database
const droneDatabase = [
  {
    id: "dji-mavic-3",
    name: "DJI Mavic 3",
    manufacturer: "DJI",
    type: "Consumer Drone",
    introduced: "November 2021",
    status: "Active",
    maxSpeed: "47 mph (75.6 km/h)",
    maxFlightTime: "46 minutes",
    range: "30 km / 18.6 miles",
    weight: "895g",
    dimensions: "Folded: 221×96.3×90.3 mm, Unfolded: 347.5×283×107.7 mm",
    camera: "4/3 CMOS Hasselblad Camera",
    radioFrequency: "2.4-2.4835 GHz, 5.725-5.850 GHz",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    detectionMethods: [
      { name: "RF Signature Analysis", accuracy: 92 },
      { name: "Visual Recognition", accuracy: 85 },
      { name: "Acoustic Detection", accuracy: 68 }
    ],
    threatLevel: "Low"
  },
  {
    id: "autel-evo-ii",
    name: "Autel EVO II",
    manufacturer: "Autel Robotics",
    type: "Professional Drone",
    introduced: "January 2020",
    status: "Active",
    maxSpeed: "45 mph (72 km/h)",
    maxFlightTime: "40 minutes",
    range: "9 km / 5.6 miles",
    weight: "1127g",
    dimensions: "Folded: 210×120×125 mm, Unfolded: 397×397×225 mm",
    camera: "8K Camera with 1/2\" CMOS sensor",
    radioFrequency: "2.4 GHz, 5.8 GHz",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    detectionMethods: [
      { name: "RF Signature Analysis", accuracy: 89 },
      { name: "Visual Recognition", accuracy: 82 },
      { name: "Radar Detection", accuracy: 91 }
    ],
    threatLevel: "Low"
  },
  {
    id: "skydio-x2",
    name: "Skydio X2",
    manufacturer: "Skydio",
    type: "Enterprise/Military Drone",
    introduced: "September 2020",
    status: "Active",
    maxSpeed: "36 mph (58 km/h)",
    maxFlightTime: "35 minutes",
    range: "6 km / 3.7 miles",
    weight: "775g",
    dimensions: "260×260×78 mm",
    camera: "4K Camera with Thermal Imaging",
    radioFrequency: "2.4 GHz, 5.8 GHz",
    imageUrl: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    detectionMethods: [
      { name: "Thermal Detection", accuracy: 94 },
      { name: "RF Signature Analysis", accuracy: 88 },
      { name: "Visual Recognition", accuracy: 90 }
    ],
    threatLevel: "Medium"
  },
  {
    id: "parrot-anafi-usa",
    name: "Parrot ANAFI USA",
    manufacturer: "Parrot",
    type: "Professional/Security Drone",
    introduced: "June 2020",
    status: "Active",
    maxSpeed: "34 mph (55 km/h)",
    maxFlightTime: "32 minutes",
    range: "4 km / 2.5 miles",
    weight: "500g",
    dimensions: "Folded: 252×104×82 mm, Unfolded: 282×373×84 mm",
    camera: "4K HDR Camera with 32x zoom",
    radioFrequency: "2.4 GHz, 5.8 GHz",
    imageUrl: "https://images.unsplash.com/photo-1544169064-30ee1987dd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    detectionMethods: [
      { name: "RF Signature Analysis", accuracy: 86 },
      { name: "Visual Recognition", accuracy: 78 },
      { name: "Acoustic Detection", accuracy: 72 }
    ],
    threatLevel: "Low"
  },
  {
    id: "custom-fpv-drone",
    name: "Custom FPV Racing Drone",
    manufacturer: "DIY/Custom",
    type: "Racing/Custom Drone",
    introduced: "Various",
    status: "Active",
    maxSpeed: "90+ mph (145+ km/h)",
    maxFlightTime: "8-10 minutes",
    range: "2-3 km / 1.2-1.8 miles",
    weight: "~500g",
    dimensions: "Varies (~250mm diagonal)",
    camera: "HD FPV Camera",
    radioFrequency: "2.4 GHz, 5.8 GHz",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    detectionMethods: [
      { name: "RF Signature Analysis", accuracy: 95 },
      { name: "Visual Recognition", accuracy: 65 },
      { name: "Movement Pattern Analysis", accuracy: 88 }
    ],
    threatLevel: "Medium"
  }
];

// Types for drone detection
export interface DetectionMethod {
  name: string;
  accuracy: number;
}

export interface DroneDetectionResult {
  droneId: string;
  droneName: string;
  confidence: number;
  detectedImage: string;
  referenceImage: string;
  specifications: {
    [key: string]: string;
  };
  analysisData: {
    [key: string]: string;
  };
  detectionMethods: DetectionMethod[];
  threatLevel: string;
  detectionTime: string;
}

// Mock function to simulate drone detection
export const detectDrone = (imageUrl: string): Promise<DroneDetectionResult> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Randomly select a drone from the database for demo purposes
      // In a real app, this would be an ML model analyzing the image
      const randomIndex = Math.floor(Math.random() * droneDatabase.length);
      const detectedDrone = droneDatabase[randomIndex];

      // Generate random confidence score between 80-99%
      const confidence = 80 + Math.floor(Math.random() * 19);
      
      // Current date and time
      const detectionTime = new Date().toISOString();
      
      // Create a result object
      const result: DroneDetectionResult = {
        droneId: detectedDrone.id,
        droneName: detectedDrone.name,
        confidence: confidence,
        detectedImage: imageUrl,
        referenceImage: detectedDrone.imageUrl,
        specifications: {
          manufacturer: detectedDrone.manufacturer,
          type: detectedDrone.type,
          introduced: detectedDrone.introduced,
          status: detectedDrone.status,
          maxSpeed: detectedDrone.maxSpeed,
          maxFlightTime: detectedDrone.maxFlightTime,
          range: detectedDrone.range,
          weight: detectedDrone.weight,
          dimensions: detectedDrone.dimensions,
          camera: detectedDrone.camera,
          radioFrequency: detectedDrone.radioFrequency
        },
        analysisData: {
          estimatedLocation: "Detected within " + (Math.floor(Math.random() * 500) + 100) + "m",
          altitude: Math.floor(Math.random() * 120) + "m",
          heading: ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"][Math.floor(Math.random() * 8)],
          estimatedSpeed: Math.floor(Math.random() * 30) + 10 + "km/h",
          signalStrength: ["Strong", "Medium", "Weak"][Math.floor(Math.random() * 3)],
          detectionMethod: ["RF Analysis", "Visual", "Acoustic", "Radar", "Combined"][Math.floor(Math.random() * 5)]
        },
        detectionMethods: detectedDrone.detectionMethods,
        threatLevel: detectedDrone.threatLevel,
        detectionTime: detectionTime
      };

      resolve(result);
    }, 2500); // Simulate 2.5 second processing time
  });
};

// Function to save results to local storage
export const saveDetectionResult = (result: DroneDetectionResult) => {
  try {
    // Get existing results or initialize empty array
    const existingResults = localStorage.getItem('droneDetectionResults');
    const resultsArray = existingResults ? JSON.parse(existingResults) : [];
    
    // Add result to array
    resultsArray.push(result);
    
    // Save back to localStorage
    localStorage.setItem('droneDetectionResults', JSON.stringify(resultsArray));
    
    return true;
  } catch (error) {
    toast.error("Failed to save result");
    console.error("Error saving detection result:", error);
    return false;
  }
};

// Function to get all saved results
export const getSavedResults = () => {
  try {
    const results = localStorage.getItem('droneDetectionResults');
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("Error retrieving saved results:", error);
    return [];
  }
};
