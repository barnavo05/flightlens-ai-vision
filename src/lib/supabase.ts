
import { createClient } from '@supabase/supabase-js';

// Default Supabase URL and key for development - these won't work in production
// You'll need to set up your own Supabase project and add the proper environment variables
const DEFAULT_SUPABASE_URL = 'https://supabase.lovableproject.com';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Display helpful console messages for development
const usingDefaultCredentials = supabaseUrl === DEFAULT_SUPABASE_URL || supabaseKey === DEFAULT_SUPABASE_ANON_KEY;
if (usingDefaultCredentials) {
  console.warn(
    "⚠️ Using default Supabase credentials. For full functionality, please set up your own Supabase project and configure the environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. You can find these in your Supabase project settings under API."
  );
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Flag to check if we're using demo credentials (for UI feedback)
export const isDemoMode = usingDefaultCredentials;

// Authentication functions
export async function signInWithEmail(email: string, password: string) {
  try {
    // In demo mode, simulate successful login for demonstration purposes
    if (isDemoMode) {
      console.log('Demo mode: Simulating successful login');
      return { 
        data: { 
          user: { 
            id: 'demo-user-id', 
            email: email,
            user_metadata: { name: email.split('@')[0] } 
          }, 
          session: { access_token: 'demo-token' } 
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
    }
    
    return { data, error };
  } catch (err) {
    console.error('Unexpected error during login:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during login.' } 
    };
  }
}

export async function signUpWithEmail(email: string, password: string, metadata: { name: string }) {
  try {
    // In demo mode, simulate successful signup for demonstration purposes
    if (isDemoMode) {
      console.log('Demo mode: Simulating successful signup');
      return { 
        data: { 
          user: { 
            id: 'demo-user-id', 
            email: email,
            user_metadata: metadata
          },
          session: { access_token: 'demo-token' } 
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      }
    });
    
    if (error) {
      console.error('Signup error:', error.message);
    }
    
    return { data, error };
  } catch (err) {
    console.error('Unexpected error during signup:', err);
    return { 
      data: null, 
      error: { message: 'An unexpected error occurred during signup.' } 
    };
  }
}

export async function signOut() {
  try {
    // In demo mode, just return success
    if (isDemoMode) {
      console.log('Demo mode: Simulating successful logout');
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Unexpected error during signout:', err);
    return { 
      error: { message: 'An unexpected error occurred during sign out.' } 
    };
  }
}

export async function getCurrentSession() {
  try {
    // In demo mode, return demo session if previously "logged in"
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        return { access_token: 'demo-token', user: JSON.parse(demoUser) };
      }
      return null;
    }
    
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    // In demo mode, return demo user if previously "logged in"
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        return JSON.parse(demoUser);
      }
      return null;
    }
    
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
    return data.user;
  } catch (err) {
    console.error('Unexpected error getting user:', err);
    return null;
  }
}

// Helper function to check if a user is logged in
export async function isAuthenticated() {
  const session = await getCurrentSession();
  return !!session;
}
