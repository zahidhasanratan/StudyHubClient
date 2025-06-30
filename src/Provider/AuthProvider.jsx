import React, { createContext, useEffect, useState } from "react";
import { app } from "../Firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJwt = async (email) => {
    try {
      await fetch("https://groupstudy.vercel.app/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("JWT fetch failed", error);
    }
  };

  const createUser = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await fetchJwt(result.user.email);
    return result;
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchJwt(result.user.email);
    return result;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    await fetchJwt(result.user.email);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await fetch("https://groupstudy.vercel.app/logout", {
      method: "POST",
      credentials: "include",
    });
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};
