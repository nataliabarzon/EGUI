'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

// Helper function to decode JWT payload
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    return JSON.parse(atob(payload)); // Decode base64 payload
  } catch {
    return null;
  }
};

// Check if token is valid (not expired)
const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  return decoded && decoded.exp * 1000 > Date.now(); // Check expiration
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => typeof window !== 'undefined' && localStorage.getItem('user'));
  const router = useRouter();

  useEffect(() => {
    if (!token || !isTokenValid(token)) {
      localStorage.removeItem('user');
      router.push('/auth/login');
    }
  }, [token, router]);
  const userObject = JSON.parse(token);

  console.log(userObject?.user?.role);

  return (
    <AuthContext.Provider value={{ userObject }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);