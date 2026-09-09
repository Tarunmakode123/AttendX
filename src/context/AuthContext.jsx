import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

// 5 Realistic Faculty Accounts + 1 HOD/Admin Account
export const DEMO_USERS = [
  {
    id: 'fac-101',
    faculty_id: 'FAC001',
    name: 'Dr. Amit Sharma',
    email: 'amit.sharma@college.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    subjects: ['Artificial Intelligence', 'Software Engineering']
  },
  {
    id: 'fac-102',
    faculty_id: 'FAC002',
    name: 'Prof. Neha Verma',
    email: 'neha.verma@college.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    subjects: ['Database Management Systems', 'Database Lab']
  },
  {
    id: 'fac-103',
    faculty_id: 'FAC003',
    name: 'Dr. Rahul Joshi',
    email: 'rahul.joshi@college.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    subjects: ['Operating Systems', 'Compiler Design']
  },
  {
    id: 'fac-104',
    faculty_id: 'FAC004',
    name: 'Prof. Priya Mehta',
    email: 'priya.mehta@college.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    subjects: ['Computer Networks']
  },
  {
    id: 'fac-105',
    faculty_id: 'FAC005',
    name: 'Dr. Arjun Kapoor',
    email: 'arjun.kapoor@college.edu',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    subjects: ['Machine Learning']
  },
  {
    id: 'admin-001',
    faculty_id: 'HOD001',
    name: 'Dr. Rajesh Sharma (HOD)',
    email: 'hod.cs@college.edu',
    role: 'admin',
    department: 'Computer Science & Engineering',
    subjects: ['Department Head — All CSE Subjects']
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]); // Default to Dr. Amit Sharma
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isDemoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false';

  useEffect(() => {
    if (isLiveSupabaseConfigured && supabase) {
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
        setCurrentUser({
          id: userId,
          faculty_id: 'FAC-LIVE',
          name: email.split('@')[0],
          email: email,
          role: email.includes('admin') || email.includes('hod') ? 'admin' : 'faculty',
          department: 'Computer Science & Engineering'
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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      } else {
        const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          setCurrentUser(foundUser);
          return { user: foundUser };
        } else {
          const newUser = {
            id: 'fac-' + Date.now(),
            faculty_id: 'FAC-' + Math.floor(100 + Math.random() * 900),
            name: email.split('@')[0],
            email: email,
            role: email.includes('admin') || email.includes('hod') ? 'admin' : 'faculty',
            department: 'Computer Science & Engineering'
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
