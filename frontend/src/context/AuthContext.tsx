/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { DEMO_PERSONAS } from './demoPersonas';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchPersona: (user: User) => void;
  logout: () => void;
  isTeacher: boolean;
  isStudent: boolean;
  demoPersonas: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ello_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors and fall back to default
    }
    // Default to Clara Vance for smooth preview
    return DEMO_PERSONAS[0];
  });

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const switchPersona = useCallback((user: User) => {
    setCurrentUser(user);
  }, [setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  useEffect(() => {
    if (!currentUser) {
      // Default initial persona is Ms. Clara Vance
      setCurrentUser(DEMO_PERSONAS[0]);
    }
  }, [currentUser, setCurrentUser]);

  const isTeacher = currentUser?.role === 'TEACHER';
  const isStudent = currentUser?.role === 'STUDENT';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchPersona,
        logout,
        isTeacher,
        isStudent,
        demoPersonas: DEMO_PERSONAS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
