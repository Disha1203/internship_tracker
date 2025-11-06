import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import React from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  degree: string;
  batch: string;
  resumeUrl?: string;
  profilePicture?: string;
  gpa?: string;
  tenthMarks?: string;
  twelfthMarks?: string;
}

export interface Application {
  id: string;
  studentId: string;
  jobId: number;
  company: string;
  position: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Rejected' | 'Accepted';
  result: string;
}

interface AuthContextType {
  currentUser: Student | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (student: Omit<Student, 'id'>, password: string) => Promise<boolean>;
  logout: () => void;
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'studentId' | 'appliedDate' | 'status' | 'result'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  // ✅ Load user and apps from localStorage on mount
  useEffect(() => {
    const storedCurrentUser = localStorage.getItem('currentUser');
    const storedApplications = localStorage.getItem('applications');

    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
    if (storedApplications) setApplications(JSON.parse(storedApplications));
  }, []);

  // ✅ Save currentUser and applications to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  // ✅ Login using Flask API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentUser(data.student);
        localStorage.setItem('currentUser', JSON.stringify(data.student));
        return true;
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  // ✅ Register using Flask API
  const register = async (studentData: Omit<Student, 'id'>, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentData, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return true;
      } else {
        console.error('Registration failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addApplication = (
    applicationData: Omit<Application, 'id' | 'studentId' | 'appliedDate' | 'status' | 'result'>
  ) => {
    if (!currentUser) return;

    const newApplication: Application = {
      id: Date.now().toString(),
      studentId: currentUser.id,
      appliedDate: new Date().toISOString(),
      status: 'Applied',
      result: 'Pending',
      ...applicationData,
    };

    setApplications((prev) => [...prev, newApplication]);
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    applications: applications.filter((a) => a.studentId === currentUser?.id),
    addApplication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
