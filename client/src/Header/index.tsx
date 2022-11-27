import { useState, useContext } from 'react';
import './Header.css';
import { auth } from '../firebase-auth';
import { Form, FormControl, Button, Modal } from 'react-bootstrap';
// import UsernamePopup from "./UsernamePopup";
// import default_profile from "../default_profile.svg";
// import useDevice from "../Hooks/useDevice";
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/ContextProvider';
import SignUp from '../Auth/SignUp';
import LogIn from '../Auth/LogIn';
import { NotificationsContext } from '../Notifications/notificationsContext';
import Toast from '../Notifications/Toast';
import styled from 'styled-components';

const ToastsContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
`;

const IconContainer = styled.div`
  position: relative;
`;

const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
`;

function Header() {
  const { user } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const logout = () => {
    auth.signOut();
  };

  const handleSearch = () => {};
  const { toasts } = useContext(NotificationsContext);

  return (
    <>
      <ToastsContainer>
        {toasts.map((toast) => (
          <Toast toast={toast} key={toast.id} />
        ))}
      </ToastsContainer>
      {!(
        window.location.href.includes('/sign-up') ||
        window.location.href.includes('/log-in')
      ) && (
        <header className="header-container">
          <div className="inner">
            <Link id="logo" to="/">
              <img src="/assets/images/PapayaLogo.svg" />
              Papayask
            </Link>
            <Form id="search-bar">
              <Button
                onClick={handleSearch}
                variant="success"
                id="search-button"
              >
                <img src={'/assets/images/search.svg'} />
              </Button>
              <FormControl
                type="text"
                placeholder="Search..."
                className="mr-sm-2"
                id="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Form>
            {user ? (
              <>
                <div className="images-header-container">
                  <img
                    className="header-img"
                    src={'/assets/images/directRequest.svg'}
                  />
                  <IconContainer>
                    {user.newQuestionsCount > 0 && (
                      <Badge>{user.newQuestionsCount}</Badge>
                    )}
                    <img
                      className="header-img"
                      src={'/assets/images/bell.svg'}
                    />
                  </IconContainer>
                  <img
                    className="header-img"
                    src={'/assets/images/message.svg'}
                  />
                  <img
                    className="header-img"
                    src={'/assets/images/heart.svg'}
                  />
                  <Link to={`/profile/${user.id}`}>
                    {' '}
                    <img
                      className="header-img"
                      src={'/assets/images/user.svg'}
                    />{' '}
                  </Link>
                </div>
              </>
            ) : (
              <div className="images-header-container">
                <img
                  className="header-img"
                  src={'/assets/images/direction.svg'}
                />
                <img className="header-img" src={'/assets/images/dollar.svg'} />
                <div className="give">Become a giver</div>
                <button
                  className="auth-button"
                  onClick={() => setShowLogIn(true)}
                >
                  Log In
                </button>
                <button
                  className="auth-button sign-up"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* {user ? (
            <Button onClick={logout}>Log Out</Button>
          ) : (
            <>
              <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
              <Button onClick={() => setShowLogIn(true)}>Log In</Button>
            </>
          )} */}
          </div>
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
