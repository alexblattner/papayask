import React, { useState, useEffect,useContext } from "react";
import "./Header.css";
import api, { baseURL } from "../utils/api"; //axios with necessary configurations
import { auth } from "../firebase-auth";
import {
  Navbar,
  Form,
  FormControl,
  Button,
  Col,
  Nav,
  Container,
  Modal,
} from "react-bootstrap";
// import UsernamePopup from "./UsernamePopup";
import default_profile from "../default_profile.svg";
import useDevice from "../Hooks/useDevice";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/ContextProvider";

function Header() {
  const user = useContext(AuthContext);
  
  const logout = async () => {
    auth.signOut();
  };

  function isJSON(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    const eventSource = new EventSource(`${baseURL}realtime-notifications`, {
      withCredentials: true,
    });
    eventSource.onmessage = (e) => {
      if (isJSON(e.data)) {
        
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <>
      {!(
        window.location.href.includes("/sign-up") ||
        window.location.href.includes("/log-in")
      ) && (
        <div id="header">
          <div
            style={{
              display: "inline-flex",
              flexDirection: "row",
              width: "70%",
            }}
          >
            {(user)?<Button onClick={logout}>Log Out</Button>:<>
            <Link to="/log-in"><Button>Log In</Button></Link>
            <Link to="/sign-up"><Button>Sign Up</Button></Link></>}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;