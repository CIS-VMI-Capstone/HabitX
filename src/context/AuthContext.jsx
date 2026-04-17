import React, { createContext, useContext, useState, useEffect } from 'react';
import Parse from '../config/parse.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from local storage on mount
    const current = Parse.User.current();
    setUser(current || null);
    setLoading(false);
  }, []);

  async function login(email, password) {
    const loggedIn = await Parse.User.logIn(email.trim().toLowerCase(), password);
    setUser(loggedIn);
    return loggedIn;
  }

  async function register(email, password, displayName) {
    const newUser = new Parse.User();
    newUser.set('username', email.trim().toLowerCase());
    newUser.set('password', password);
    newUser.set('email', email.trim().toLowerCase());
    if (displayName?.trim()) newUser.set('displayName', displayName.trim());
    await newUser.signUp();
    setUser(newUser);
    return newUser;
  }

  async function logout() {
    await Parse.User.logOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
