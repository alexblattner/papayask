import React, { useContext, useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from "../firebase-auth";
import { AuthContext } from "./ContextProvider";
import {Navigate} from 'react-router-dom';
import "./Auth.css";
import api from "../utils/api";
interface Props {
  type: string;//whether it is sign up or log in
}
//https://www.quackit.com/html/codes/html_popup_window_code.cfm
const AuthForm = (props:Props) => {//this helps mediate login and signup. they usually have the same fields
    const {user} = useContext(AuthContext);//this is the user data
    const [type,setType] = useState(props.type);//this is the type of form and is set up at the beginning
    const [correctEmail, setCorrectEmail] = useState<boolean>(true);//this is to check if the email is valid and display an error message
    const [correctPassword, setCorrectPassword] = useState<boolean>(true);//this is to check if the password is valid and display an error message
    const [error, setError] = useState<string>("");
    const google=async()=>{//this is the google login/sign up function
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        });
    }
    const facebook=async()=>{//this is the facebook login/sign up function
      await auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(async(userCred:any) => {
        if (userCred) {
          window.localStorage.setItem('auth', 'true');
        }
      });
    }
    const emailPassword=async(e:React.FormEvent<HTMLFormElement>)=>{//this is the email and password login/sign up function
      e.preventDefault();
      let email = ((e.target as HTMLInputElement).childNodes[0]as HTMLInputElement).value;
      let password = ((e.target as HTMLInputElement).childNodes[1]as HTMLInputElement).value;
      if(props.type=="login"){//if it is a login form
        await auth.signInWithEmailAndPassword(email,password)//sign in with email and password
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        }).catch((err:any)=>{
          setError(err.message)
        });
      }else{//if it is a sign up form
        await auth.createUserWithEmailAndPassword(email,password)//create a user with email and password
        .then(async(userCred:any) => {
          if (userCred) {
            window.localStorage.setItem('auth', 'true');
          }
        }).catch((err:any)=>{
          setError(err.message)
        });
      }
    }
    function validateEmail(e:React.FocusEvent<HTMLInputElement, Element>){
      var email = (e.target as HTMLInputElement).value;
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regex.test(String(email).toLowerCase())) {//if the email is valid
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
        {type=="login"?<span id="forgot-password">Forgot password?</span>:null}
        <p>{type=="login"?<>Don't have an account? <span onClick={()=>setType("signup")}>Sign Up</span></>:<>Already have an account? <span onClick={()=>setType("login")}>Log In</span></>}</p>
        {error}
      </div>
    );
};

export default AuthForm;