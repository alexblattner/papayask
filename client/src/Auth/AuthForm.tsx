import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from "../firebase-auth";
import { AuthContext } from "./ContextProvider";
import { Navigate } from "react-router-dom";
import "./Auth.css";
import api from "../utils/api";
interface Props {
  type: string; //whether it is sign up or log in
}
//https://www.quackit.com/html/codes/html_popup_window_code.cfm
const AuthForm = (props: Props) => {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState(props.type);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const google = async () => {
    await auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(async (userCred: any) => {
        if (userCred) {
          window.localStorage.setItem("auth", "true");
        }
      })
      .catch((error) => {
        console.log(12345, error);
      });
  };
  const facebook = async () => {
    await auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(async (userCred: any) => {
        if (userCred) {
          window.localStorage.setItem("auth", "true");
        }
      })
      .catch((err) => {
        let message = err.message;
        if (message.includes("email")) {
          message = "Email already in use";
        }
        alert(message);
      });
  };
  const emailPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let email = (
      (e.target as HTMLInputElement).childNodes[0] as HTMLInputElement
    ).value;
    let password = (
      (e.target as HTMLInputElement).childNodes[1] as HTMLInputElement
    ).value;
    console.log(email, password);
    if (props.type == "login") {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (userCred: any) => {
          if (userCred) {
            window.localStorage.setItem("auth", "true");
          }
        })
        .catch((err: any) => {
          setError(err.message);
        });
    } else {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCred: any) => {
          if (userCred) {
            window.localStorage.setItem("auth", "true");
          }
        })
        .catch((err: any) => {
          setError(err.message);
        });
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="connection">
      <h2>{type == "login" ? "Log In" : "Sign Up"}</h2>
      <button id="facebook" className="thirdparty" onClick={facebook}>
        facebook
      </button>
      <button id="google" className="thirdparty" onClick={google}>
        google
      </button>
      <div className="divider">
        <div className="line"></div>OR<div className="line"></div>
      </div>
      <form onSubmit={emailPassword}>
        <input
          type="text"
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <input
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          type="password"
        />
        <input type="submit" value={type == "login" ? "Log In!" : "Sign Up!"} />
      </form>
      {type == "login" ? (
        <span id="forgot-password">I forgot my password</span>
      ) : null}
      <p>
        {type == "login" ? (
          <>
            Don't have an account?{" "}
            <span onClick={() => setType("signup")}>Sign Up</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setType("login")}>Log In</span>
          </>
        )}
      </p>
      {error}
    </div>
  );
};

export default AuthForm;
