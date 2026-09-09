import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

// Pre-configured Demo Users for instant testing
export const DEMO_USERS = [
  {
    id: 'fac-001',
    name: 'Prof. Alan Turing',
    email: 'alan@college.edu',
    role: 'faculty',
    department: 'Computer Science',
    assigned_sections: ['CS-A', 'CS-B']
  },
  {
    id: 'fac-002',
    name: 'Prof. Priya Sharma',
    email: 'priya@college.edu',
    role: 'faculty',
    department: 'Computer Science',
    assigned_sections: ['CS-A', 'EC-A']
  },
  {
    id: 'admin-001',
    name: 'Dr. Rajesh Sharma (HOD)',
    email: 'hod.cs@college.edu',
    role: 'admin',
    department: 'Computer Science & Engineering',
    assigned_sections: ['CS-A', 'CS-B', 'EC-A', 'ME-A']
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]); // Default to Prof. Alan
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Check if Demo Mode switcher is enabled (defaults to true in dev preview unless explicitly disabled)
  const isDemoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false';

  useEffect(() => {
    if (isLiveSupabaseConfigured && supabase) {
      // Fetch initial session from Supabase Auth if live credentials exist
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchFacultyProfile(session.user.id, session.user.email);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await fetchFacultyProfile(session.user.id, session.user.email);
        } else {
          setCurrentUser(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const fetchFacultyProfile = async (userId, email) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Fallback profile if user exists in Auth but not in faculty table yet
        setCurrentUser({
          id: userId,
          name: email.split('@')[0],
          email: email,
          role: 'faculty'
        });
      } else {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    setLoading(true);
    try {
      if (isLiveSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        return data;
      } else {
        // Mock Auth Fallback
        const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          setCurrentUser(foundUser);
          return { user: foundUser };
        } else {
          // Allow custom faculty login in mock mode
          const newUser = {
            id: 'fac-' + Date.now(),
            name: email.split('@')[0],
            email: email,
            role: email.includes('admin') || email.includes('hod') ? 'admin' : 'faculty',
            department: 'Computer Science'
          };
          setCurrentUser(newUser);
          return { user: newUser };
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchDemoUser = (userId) => {
    if (!isDemoModeEnabled) return;
    const target = DEMO_USERS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const logout = async () => {
    if (isLiveSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        isDemoModeEnabled,
        loginWithEmail,
        switchDemoUser,
        logout,
        isAdmin: currentUser?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
