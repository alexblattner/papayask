import React, { useState, useContext } from 'react';
import './Header.css';
import { auth } from '../firebase-auth';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

import { AuthContext } from '../Auth/ContextProvider';
import SignUp from '../Auth/SignUp';
import LogIn from '../Auth/LogIn';
import ProfileSetup from '../profile/ProfileSetup';
import useWidth from '../Hooks/useWidth';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

const StyledHeader = styled.header`
  width: 100%;
  height: 80px;
  top: 0;
  left: 0;
  border-bottom: 1px solid #e4e5e7;
  background: white;
  z-index: 1000;
  position: fixed;
`;

function Header() {
  const { user } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showLogIn, setShowLogIn] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showProfileSetup, setShowProfileSetup] =
    React.useState<boolean>(false);
  const logout = () => {
    auth.signOut();
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };
  const { width } = useWidth();

  return (
    <>
   

      {!(
        window.location.href.includes('/sign-up') ||
        window.location.href.includes('/log-in')
      ) && (
        <>
          {showProfileSetup && (
            <ProfileSetup
              setShowProfileSetup={setShowProfileSetup}
              type={'initial'}
              initialStep={0}
            />
          )}
          <StyledHeader>
            {width > 890 ? (
              <DesktopHeader
                handleSearch={handleSearch}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                setShowProfileSetup={setShowProfileSetup}
                setShowSignUp={setShowSignUp}
                setShowLogIn={setShowLogIn}
              />
            ) : (
              <MobileHeader
                setShowProfileSetup={setShowProfileSetup}
                setShowSignUp={setShowSignUp}
                setShowLogIn={setShowLogIn}
              />
            )}
          </StyledHeader>
        </>
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
