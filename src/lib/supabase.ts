
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Default to empty strings to prevent runtime errors, but client won't work without proper values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL and Anon Key are required. Make sure you've set the environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export async function signInWithEmail(email: string, password: string) {
  try {
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
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

export async function getCurrentUser() {
  try {
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
