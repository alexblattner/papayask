import React, { useState, useEffect, useContext } from "react";
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
// import default_profile from "../default_profile.svg";
// import useDevice from "../Hooks/useDevice";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth/ContextProvider";
import SignUp from "../Auth/SignUp";
import LogIn from "../Auth/LogIn";
function Header() {
  const { user } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const logout = () => {
    auth.signOut();
  };

  const handleSearch = () => {};

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
        <header className="header-container">
          <Link id="logo" to="/">
            <img src="/assets/images/PapayaLogo.svg" />
            Papayask
          </Link>

          <Form id="search-bar">
            <Button onClick={handleSearch} variant="success" id="search-button">
              <img src={"/assets/images/search.svg"} />
            </Button>
            <FormControl
              type="text"
              placeholder="Search..."
              className="mr-sm-2"
              id="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button variant="success" id="speaker-button">
              <img src={"/assets/images/speaker.svg"} />
            </Button>
          </Form>

          <div className="images-header-container">
            <img
              className="header-img"
              src={"/assets/images/directRequest.svg"}
            />
            <img className="header-img" src={"/assets/images/bell.svg"} />
            <img className="header-img" src={"/assets/images/message.svg"} />
            <img className="header-img" src={"/assets/images/heart.svg"} />
            <img className="header-img" src={"/assets/images/user.svg"} />
          </div>

          {/* {user ? (
            <Button onClick={logout}>Log Out</Button>
          ) : (
            <>
              <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
              <Button onClick={() => setShowLogIn(true)}>Log In</Button>
            </>
          )} */}
        </header>
      )}
      {showSignUp ? (
        <Modal
          show={showSignUp && !user}
          onHide={() => setShowSignUp(false)}
          dialogClassName="register-modal"
        >
          <SignUp />
        </Modal>
      ) : null}
      {showLogIn ? (
        <Modal
          show={showLogIn && !user}
          onHide={() => setShowLogIn(false)}
          dialogClassName="register-modal"
        >
          <LogIn />
        </Modal>
      ) : null}
    </>
  );
}

export default Header;
