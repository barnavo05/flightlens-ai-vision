
import { toast } from "sonner";
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut as supabaseSignOut, 
  getCurrentUser as getSupabaseUser,
  isDemoMode
} from "@/lib/supabase";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Check if user is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getSupabaseUser();
  return user !== null;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await getSupabaseUser();
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || ''
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await signInWithEmail(email, password);
    
    if (error) {
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
    }
    
    if (!data.user) {
      toast.error("Login failed");
      return { success: false, error: "User not found" };
    }
    
    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.name || email.split('@')[0],
      email: email
    };
    
    // In demo mode, store the demo user in localStorage
    if (isDemoMode) {
      localStorage.setItem('demoUser', JSON.stringify(data.user));
    }
    
    toast.success("Login successful!");
    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed");
    return { success: false, error: "Login failed" };
  }
};

// Sign up
export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await signUpWithEmail(email, password, { name });
    
    if (error) {
      toast.error(error.message || "Registration failed");
      return { success: false, error: error.message };
    }
    
    if (!data.user) {
      toast.error("Registration failed");
      return { success: false, error: "Could not create user" };
    }
    
    const user: User = {
      id: data.user.id,
      name: name,
      email: email
    };
    
    // In demo mode, store the demo user in localStorage
    if (isDemoMode) {
      localStorage.setItem('demoUser', JSON.stringify(data.user));
    }
    
    toast.success(isDemoMode ? 
      "Demo account created successfully!" : 
      "Account created successfully! Please check your email for verification.");
    return { success: true, user };
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Registration failed");
    return { success: false, error: "Registration failed" };
  }
};

// Log out
export const logout = async (): Promise<void> => {
  try {
    // In demo mode, clear localStorage
    if (isDemoMode) {
      localStorage.removeItem('demoUser');
    }
    
    await supabaseSignOut();
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Logout failed");
  }
};
