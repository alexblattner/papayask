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
import SignUp from "../Auth/SignUp";
import LogIn from "../Auth/LogIn";
function Header() {
  const {user} = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const logout =() => {
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
        <header>
          <Link id="logo" to="/">Papayask</Link>
          <div id="search-bar">
            <Form>
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                id="search-input"
              />
              <Button variant="success" id="search-button">
                Search
              </Button>
            </Form>
          </div>
              {(user)?<Button onClick={logout}>Log Out</Button>:<>
              <Button onClick={()=>setShowSignUp(true)}>Sign Up</Button><Button onClick={()=>setShowLogIn(true)}>Log In</Button></>}
        </header>
      )}
      {showSignUp?<Modal
      show={showSignUp}
      onHide={() => setShowSignUp(false)}
      dialogClassName="review-modal"
    ><SignUp/></Modal>:null}
      {showLogIn?<Modal
      show={showLogIn}
      onHide={() => setShowLogIn(false)}
      dialogClassName="review-modal"
    ><LogIn/></Modal>:null}
    </>
  );
}

export default Header;