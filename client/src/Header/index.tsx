import React, { useState, useContext } from 'react';
import { auth } from '../firebase-auth';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

import { AuthContext } from '../Auth/ContextProvider';
import SignUp from '../Auth/SignUp';
import LogIn from '../Auth/LogIn';
import { NotificationsContext } from '../Notifications/notificationsContext';
import Toast from '../Notifications/Toast';
import ProfileSetup from '../profile/ProfileSetup';
import useWidth from '../Hooks/useWidth';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import Drawer from './Drawer';

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
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showLogIn, setShowLogIn] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showProfileSetup, setShowProfileSetup] =
    React.useState<boolean>(false);
  const logout = () => {
    auth.signOut();
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };
  const { toasts } = useContext(NotificationsContext);
  const { width } = useWidth();

  return (
    <>
      {showDrawer && <Drawer setShowDrawer={setShowDrawer} />}
      <ToastsContainer>
        {toasts.map((toast) => (
          <Toast toast={toast} key={toast.id} />
        ))}
      </ToastsContainer>

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
                setShowDrawer={setShowDrawer}
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
