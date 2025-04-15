
import { toast } from "sonner";

// Aircraft database for recognition
const aircraftDatabase = [
  {
    id: "boeing-747-400",
    name: "Boeing 747-400",
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
    engine: "4 × General Electric CF6 or Pratt & Whitney PW4000",
    imageUrl: "https://images.unsplash.com/photo-1520437358207-323b43b50729?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    similarModels: [
      { name: "Boeing 747-8", similarity: 92 },
      { name: "Boeing 777-300", similarity: 78 },
      { name: "Airbus A380", similarity: 65 }
    ]
  },
  {
    id: "airbus-a380",
    name: "Airbus A380",
    manufacturer: "Airbus",
    type: "Wide-body airliner",
    firstFlight: "April 27, 2005",
    introduced: "October 25, 2007, with Singapore Airlines",
    status: "In service",
    produced: "2003-2021",
    length: "238 ft 7 in (72.72 m)",
    wingspan: "261 ft 8 in (79.75 m)",
    height: "79 ft 0 in (24.09 m)",
    maxSpeed: "Mach 0.85 (560 mph, 900 km/h)",
    range: "8,000 nmi (14,800 km)",
    engine: "4 × Engine Alliance GP7000 or Rolls-Royce Trent 900",
    imageUrl: "https://images.unsplash.com/photo-1624982102550-5f063977110e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    similarModels: [
      { name: "Boeing 747-8", similarity: 85 },
      { name: "Boeing 777X", similarity: 70 },
      { name: "Airbus A350", similarity: 65 }
    ]
  },
  {
    id: "boeing-737-800",
    name: "Boeing 737-800",
    manufacturer: "Boeing Commercial Airplanes",
    type: "Narrow-body airliner",
    firstFlight: "July 31, 1997",
    introduced: "April 1998, with Hapag-Lloyd",
    status: "In service",
    produced: "1997-present",
    length: "129 ft 6 in (39.5 m)",
    wingspan: "117 ft 10 in (35.9 m)",
    height: "41 ft 2 in (12.5 m)",
    maxSpeed: "Mach 0.82 (544 mph, 876 km/h)",
    range: "3,115 nmi (5,765 km)",
    engine: "2 × CFM56-7B turbofan",
    imageUrl: "https://images.unsplash.com/photo-1594631661960-34762327295a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    similarModels: [
      { name: "Airbus A320", similarity: 88 },
      { name: "Boeing 737-700", similarity: 85 },
      { name: "Boeing 737 MAX", similarity: 82 }
    ]
  },
  {
    id: "cessna-172",
    name: "Cessna 172 Skyhawk",
    manufacturer: "Cessna",
    type: "Light aircraft",
    firstFlight: "June 12, 1955",
    introduced: "1956",
    status: "In production",
    produced: "1956-present",
    length: "27 ft 2 in (8.28 m)",
    wingspan: "36 ft 1 in (11.00 m)",
    height: "8 ft 11 in (2.72 m)",
    maxSpeed: "188 mph (302 km/h)",
    range: "640 nmi (1,185 km)",
    engine: "1 × Lycoming IO-360-L2A flat-4 engine, 160 hp (120 kW)",
    imageUrl: "https://images.unsplash.com/photo-1583386782588-8fb3719c17dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    similarModels: [
      { name: "Cessna 152", similarity: 90 },
      { name: "Piper Cherokee", similarity: 75 },
      { name: "Cessna 182", similarity: 88 }
    ]
  }
];

// Mock function to simulate image analysis
export const analyzeAircraftImage = (imageUrl: string): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Randomly select an aircraft from the database for demo purposes
      // In a real app, this would be an ML model analyzing the image
      const randomIndex = Math.floor(Math.random() * aircraftDatabase.length);
      const detectedAircraft = aircraftDatabase[randomIndex];

      // Generate random confidence score between 90-99%
      const confidence = 90 + Math.floor(Math.random() * 9);
      
      // Create a result object
      const result = {
        aircraftId: detectedAircraft.id,
        aircraftName: detectedAircraft.name,
        confidence: confidence,
        uploadedImage: imageUrl,
        referenceImage: detectedAircraft.imageUrl,
        specifications: {
          manufacturer: detectedAircraft.manufacturer,
          type: detectedAircraft.type,
          firstFlight: detectedAircraft.firstFlight,
          introduced: detectedAircraft.introduced,
          status: detectedAircraft.status,
          produced: detectedAircraft.produced,
          length: detectedAircraft.length,
          wingspan: detectedAircraft.wingspan,
          height: detectedAircraft.height,
          maxSpeed: detectedAircraft.maxSpeed,
          range: detectedAircraft.range,
          engine: detectedAircraft.engine
        },
        flightPathData: {
          estimatedLocation: "Estimated from image metadata",
          altitude: Math.floor(Math.random() * 10000) + "m",
          heading: ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"][Math.floor(Math.random() * 8)]
        },
        similarModels: detectedAircraft.similarModels
      };

      resolve(result);
    }, 2500); // Simulate 2.5 second processing time
  });
};

// Function to save results to local storage
export const saveRecognitionResult = (result: any) => {
  try {
    // Get existing results or initialize empty array
    const existingResults = localStorage.getItem('recognitionResults');
    const resultsArray = existingResults ? JSON.parse(existingResults) : [];
    
    // Add timestamp to the new result
    const resultWithTimestamp = {
      ...result,
      timestamp: new Date().toISOString()
    };
    
    // Add new result to array
    resultsArray.push(resultWithTimestamp);
    
    // Save back to localStorage
    localStorage.setItem('recognitionResults', JSON.stringify(resultsArray));
    
    return true;
  } catch (error) {
    toast.error("Failed to save result");
    console.error("Error saving recognition result:", error);
    return false;
  }
};

// Function to get all saved results
export const getSavedResults = () => {
  try {
    const results = localStorage.getItem('recognitionResults');
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("Error retrieving saved results:", error);
    return [];
  }
};
