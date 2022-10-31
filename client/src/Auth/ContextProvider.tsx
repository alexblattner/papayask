import { useEffect, useState,createContext } from "react";
import firebase from "firebase/compat/app";
import { auth } from "../firebase-auth";

export const AuthContext = createContext<firebase.User | null>(null);
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);
  
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};