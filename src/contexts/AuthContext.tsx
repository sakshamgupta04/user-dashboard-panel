
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

// Define types for our context
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('people_ai_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This would be replaced with actual Supabase authentication
      const mockUsers = JSON.parse(localStorage.getItem('people_ai_users') || '[]');
      const foundUser = mockUsers.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('people_ai_user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful');
      navigate('/resume/upload');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (firstName: string, lastName: string, email: string, phoneNumber: string, password: string) => {
    setLoading(true);
    try {
      // This would be replaced with actual Supabase authentication
      const mockUsers = JSON.parse(localStorage.getItem('people_ai_users') || '[]');
      
      // Check if user already exists
      if (mockUsers.some((u: any) => u.email === email)) {
        throw new Error('User already exists with this email');
      }
      
      // Generate a unique ID
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      localStorage.setItem('people_ai_users', JSON.stringify(mockUsers));
      
      toast.success('Account created successfully. Please login to continue.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('people_ai_user');
    navigate('/');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
