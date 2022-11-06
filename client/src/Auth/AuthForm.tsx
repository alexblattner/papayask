import React, { useContext, useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from "../firebase-auth";
import { AuthContext } from "./ContextProvider";
import {Navigate} from 'react-router-dom';
import "./Auth.css";
import api from "../utils/api";
interface Props {
  type: string;
}
//https://www.quackit.com/html/codes/html_popup_window_code.cfm
const AuthForm = (props:Props) => {
    const {user} = useContext(AuthContext);
    const [type,setType] = useState(props.type);
    const [correctEmail, setCorrectEmail] = useState<boolean>(true);
    const [correctPassword, setCorrectPassword] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
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
      if(props.type=="login"){
        await auth.signInWithEmailAndPassword(email,password)
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        }).catch((err:any)=>{
          setError(err.message)
        });
      }else{
        await auth.createUserWithEmailAndPassword(email,password)
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        }).catch((err:any)=>{
          setError(err.message)
        });
      }
    }
    async function validateEmail(e:React.FocusEvent<HTMLInputElement, Element>){
      var email = (e.target as HTMLInputElement).value;
  
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regex.test(String(email).toLowerCase())) {
          setCorrectEmail(true);
      } else setCorrectEmail(false);
    }
    function validatePassword(e:React.FocusEvent<HTMLInputElement, Element>){
      var inner_password = (e.target as HTMLInputElement).value;
      if (inner_password.length < 6) {
        setCorrectPassword(false);
      } else {
        setCorrectPassword(true);
      }
    }
    return (
      <div className="connection">
        <h2>{(type=="login")?"Log In":"Sign Up"}</h2>
        <button id="facebook" className="thirdparty" onClick={facebook}>{type=="login"?"Log in with Facebook":"Sign up with Facebook"}</button>
        <button id="google" className="thirdparty" onClick={google}>{type=="login"?"Log in with Google":"Sign up with Google"}</button>
        <div className="divider"><div className="line"></div>OR<div className="line"></div></div>
        <form onSubmit={emailPassword}>
          <input type="text" placeholder={type=="login"?"Email or username":"Email"} onFocus={()=>setCorrectEmail(true)} onBlur={validateEmail}/>
          <input onFocus={()=>setCorrectPassword(true)} placeholder="Password" type="password"  onBlur={validatePassword}/>
          <input type="submit" value={type=="login"?"Log In!":"Sign Up!"} />
          </form>
        {type=="login"?<span id="forgot-password">I forgot my password</span>:null}
        <p>{type=="login"?<>Don't have an account? <span onClick={()=>setType("signup")}>Sign Up</span></>:<>Already have an account? <span onClick={()=>setType("login")}>Log In</span></>}</p>
        {error}
      </div>
    );
};

export default AuthForm;