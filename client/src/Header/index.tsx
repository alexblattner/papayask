import React, { useState, useContext } from 'react';
import './Header.css';
import { auth } from '../firebase-auth';
import { Form, FormControl, Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth/ContextProvider';
import SignUp from '../Auth/SignUp';
import LogIn from '../Auth/LogIn';
import { NotificationsContext } from '../Notifications/notificationsContext';
import Toast from '../Notifications/Toast';
import { ReactComponent as FullLogo } from '../full_logo.svg';
import SvgIcon from '../shared/SvgIcon';
import { Text } from '../shared/Text';
import { Container } from '../shared/Container';

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

const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  gap: 16px;
  width: 80%;
  left: 10%;
  padding: 20px 0px;
`;

const SearchWrapper = styled(Form)`
  position: relative;
  display: flex;
  border-radius: 8px;
  width: 250px;
  border: 2px solid black;
  transition: all 0.3s ease-in-out;

  &:focus,
  &:focus-within {
    width: 100%;
  }
`;

const SpeakerIcon = styled('div')`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;

const SearchButton = styled(Button)`
  all: unset;
  padding: 0.5rem 1rem;
`;

const SearchInput = styled(FormControl)`
  height: 100%;
  width: 100%;
  border: none;
  border-radius: 8px;
  color: black;

  ::placeholder {
    font-size: 1.1rem;
    font-weight: bold;
  }

  &:focus,
  &:focus-within {
    outline: none;
    border: none;
    -moz-box-shadow: none;
    -goog-ms-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
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

const SellerButton = styled('div')`
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 4px 1px 4px 8px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
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
        <StyledHeader>
          <HeaderContainer>
            <Link to="/">
              <FullLogo width={150} height={50} />
            </Link>

            <SearchWrapper>
              <SearchButton onClick={handleSearch}>
                <SvgIcon src="search" />
              </SearchButton>
              <SearchInput
                type="text"
                placeholder="Search..."
                className="mr-sm-2"
                value={searchInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInput(e.target.value)
                }
              />
              <SpeakerIcon>
                <SvgIcon src="speaker" />
              </SpeakerIcon>
            </SearchWrapper>

            {user ? (
              <>
                <Container flex align="center" gap={16} ml="auto">
                  <Text fontSize={18} fontWeight={'bold'}>
                    Requests
                  </Text>
                  <Text fontSize={18} fontWeight={'bold'}>
                    Notifications
                  </Text>
                  <Text fontSize={18} fontWeight={'bold'}>
                    Favorites
                  </Text>
                  <StyledLink to={`/profile/${user.id}`}>
                    <SellerButton>
                      <Text fontSize={18} fontWeight="bold" color="white">
                        Giver
                      </Text>
                      <SvgIcon src="user" color="white" />
                    </SellerButton>
                  </StyledLink>
                </Container>
              </>
            ) : (
              <Container flex align="center" gap={16} ml="auto">
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
              </Container>
            )}

            {/* {user ? (
            <Button onClick={logout}>Log Out</Button>
          ) : (
            <>
              <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
              <Button onClick={() => setShowLogIn(true)}>Log In</Button>
            </>
          )} */}
          </HeaderContainer>
        </StyledHeader>
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
