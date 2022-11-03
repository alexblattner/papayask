import { useEffect, useState,createContext } from "react";
import firebase from "firebase/compat/app";
import { auth } from "../firebase-auth";
import api from "../utils/api";

export const AuthContext = createContext<firebase.User | null>(null);
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const register=async(token:any,body:any)=>{
    const res=await api({method: 'post', url: '/user',headers: {
      Authorization: 'Bearer ' + token,
    },data:body});
    console.log(8421,res)
    setUser(res.data);
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        register(token,{email:user.email,displayName:user.displayName})
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [user]);
  
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};