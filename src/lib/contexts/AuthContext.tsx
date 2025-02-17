"use client";

import React, { createContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Attempting Google sign in");
      const result = await signInWithPopup(auth, provider);
      console.log("Sign in successful:", result.user.email);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      console.log("Attempting sign out");
      await firebaseSignOut(auth);
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
