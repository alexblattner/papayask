import React, { useContext, useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from "../firebase-auth";
import { AuthContext } from "./ContextProvider";
import {Navigate} from 'react-router-dom';

import api from "../utils/api";

//https://www.quackit.com/html/codes/html_popup_window_code.cfm
const LogIn = () => {
    const user = useContext(AuthContext);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const register=async(token:any,body:any)=>{
      const res=await api({method: 'post', url: '/login',headers: {
        Authorization: 'Bearer ' + token,
      },data:body});
    }
    const google=async()=>{
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        });
    }
    const facebook=async()=>{
      await auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(async(userCred:any) => {
        if (userCred) {
          window.localStorage.setItem('auth', 'true');
        }
      });
    }
    const emailPassword=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      let email = ((e.target as HTMLInputElement).childNodes[0]as HTMLInputElement).value;
      let password = ((e.target as HTMLInputElement).childNodes[1]as HTMLInputElement).value;
      console.log(email,password)
        await auth.createUserWithEmailAndPassword(email,password)
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        }).catch((err:any)=>{
          setError(err.message)
        });
    }
    if(user){
      return <Navigate to="/" />
    }
    return (
      <div className="options">
          <form onSubmit={emailPassword}><input type="text" onChange={(e)=>setEmail((e.target as HTMLInputElement).value)}/><input onChange={(e)=>setPassword((e.target as HTMLInputElement).value)} type="password" /><input type="submit" /></form>
          <button onClick={facebook}>facebook</button>
          <button onClick={google}>google</button>
          {error}
      </div>
    );
};

export default LogIn;