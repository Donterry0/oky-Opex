'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  AuthError,
} from 'firebase/auth';
import { getFirebaseClientAuth, hasClientFirebaseConfig } from '@/lib/firebase-client';

export type AuthErrorCode = 
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | string;

export const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAvailable = hasClientFirebaseConfig();

  const login = async (email: string, password: string) => {
    if (!isAvailable) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const auth = getFirebaseClientAuth();
      if (!auth) throw new Error('Firebase not configured');
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    if (!isAvailable) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const auth = getFirebaseClientAuth();
      if (!auth) throw new Error('Firebase not configured');
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!isAvailable) return;
    
    try {
      const auth = getFirebaseClientAuth();
      if (!auth) throw new Error('Firebase not configured');
      
      await firebaseSignOut(auth);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
      throw authError;
    }
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    isAvailable,
  };
};
