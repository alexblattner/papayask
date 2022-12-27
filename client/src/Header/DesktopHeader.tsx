import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-auth';

import { ReactComponent as FullLogo } from '../full_logo.svg';
import SvgIcon from '../shared/SvgIcon';
import { AuthContext } from '../Auth/ContextProvider';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import { Button } from '../shared/Button';
import { EditProfileContext } from '../profile/profileService';
import './Header.css';

const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  gap: 16px;
  width: 90%;
  left: 5%;
  padding: 20px 0px;
`;

const SellerButton = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary);
  border-radius: 8px;
  padding: 4px 8px;
`;

const StyledLink = styled('div')`
  color: white;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
`;

interface Props {
  handleSearch: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  setShowBecomeAdvisorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopHeader = (props: Props) => {
  const { setShowBecomeAdvisorModal, setShowSignUp, setShowLogIn } = props;
  const { user } = React.useContext(AuthContext);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);

  const { editProfileShown } = React.useContext(EditProfileContext);
  const signout = () => {
    auth.signOut();
  };
  console.log(9999,user)
  return (
    <HeaderContainer>
      <Link to="/">
        <FullLogo width={150} height={50} />
      </Link>

      {user ? (
        <>
          <Container flex align="center" gap={16} ml="auto">
            {user.advisorStatus !== 'approved' && !editProfileShown && (
              <Button
                variant="outline"
                onClick={() => setShowBecomeAdvisorModal(true)}
              >
                {user.advisorStatus === 'pending'
                  ? 'PENDING'
                  : 'BECOME AN ADVISOR'}
              </Button>
            )}
            {user.advisorStatus === 'approved' ? (
              <StyledLink onClick={() => setDropDownVisible(!dropDownVisible)}>
                <SellerButton>
                  <Text fontSize={18} fontWeight="bold" color="white">
                    Advisor
                  </Text>
                  <SvgIcon src="user" color="white" />
                  {dropDownVisible ? (
                    <div id="profile-dropdown">
                      <button onClick={signout}>
                        <SvgIcon src="exit" size={18} color="white" />
                        LOG OUT
                      </button>
                    </div>
                  ) : null}
                </SellerButton>
              </StyledLink>
            ) : (
              <div
                id="profile-holder"
                onClick={() => setDropDownVisible(!dropDownVisible)}
              >
                <SvgIcon src="user" color="black" size={30} />
                {dropDownVisible ? (
                  <div id="profile-dropdown">
                    <button onClick={signout}>
                      <SvgIcon src="exit" size={18} color="white" />
                      LOG OUT
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </Container>
        </>
      ) : (
        <Container flex align="center" gap={16} ml="auto">
          <Button variant="outline" onClick={() => setShowSignUp(true)}>
            BECOME AN ADVISOR
          </Button>
          <Button variant="text" onClick={() => setShowLogIn(true)}>
            <Text fontWeight={700}>LOGIN</Text>
          </Button>
          <Button variant="primary" onClick={() => setShowSignUp(true)}>
            SIGNUP
          </Button>
        </Container>
      )}
    </HeaderContainer>
  );
};

export default DesktopHeader;
