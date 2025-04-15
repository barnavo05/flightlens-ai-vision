
import { toast } from "sonner";

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Mock authentication service using localStorage
const AUTH_STORAGE_KEY = "flightlens_auth";

// Generate a simple UUID for user IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  const authData = localStorage.getItem(AUTH_STORAGE_KEY);
  return authData !== null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Login
export const login = (email: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // For demo purposes, allow any email/password combination
      // In a real app, this would validate against a backend
      if (email && password) {
        // Create a mock user based on the email
        const user: User = {
          id: generateId(),
          name: email.split('@')[0], // Use part before @ as name
          email: email
        };
        
        // Save to localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        toast.success("Login successful!");
        resolve({ success: true, user });
      } else {
        toast.error("Invalid email or password");
        resolve({ success: false, error: "Invalid email or password" });
      }
    }, 1000);
  });
};

// Sign up
export const signup = (name: string, email: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      if (name && email && password) {
        // Create a new user
        const user: User = {
          id: generateId(),
          name,
          email
        };
        
        // Save to localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        toast.success("Account created successfully!");
        resolve({ success: true, user });
      } else {
        toast.error("All fields are required");
        resolve({ success: false, error: "All fields are required" });
      }
    }, 1000);
  });
};

// Log out
export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  toast.success("Logged out successfully");
};
