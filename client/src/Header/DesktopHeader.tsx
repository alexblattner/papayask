import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FormControl, Form } from 'react-bootstrap';

import { ReactComponent as FullLogo } from '../full_logo.svg';
import SvgIcon from '../shared/SvgIcon';
import { AuthContext } from '../Auth/ContextProvider';
import { Container } from '../shared/Container';
import { Text } from '../shared/Text';
import { Button } from '../shared/Button';
import useWidth from '../Hooks/useWidth';

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

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
`;

interface Props {
  handleSearch: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopHeader = (props: Props) => {
  const {
    handleSearch,
    searchInput,
    setSearchInput,
    setShowProfileSetup,
    setShowSignUp,
    setShowLogIn,
  } = props;
  const { user } = React.useContext(AuthContext);
  const { width } = useWidth();
  return (
    <HeaderContainer>
      <Link to="/">
        <FullLogo width={150} height={50} />
      </Link>

      {user ? (
        <>
          <Container flex align="center" gap={16} ml="auto">
            {!user.isSetUp && (
              <Button
                variant="outline"
                onClick={() => setShowProfileSetup(true)}
              >
                BECOME AN ADVISOR
              </Button>
            )}
            {user.isSetUp ? (
              <StyledLink to={`/profile/${user._id}`}>
                <SellerButton>
                  <Text fontSize={18} fontWeight="bold" color="white">
                    Advisor
                  </Text>
                  <SvgIcon src="user" color="white" />
                </SellerButton>
              </StyledLink>
            ) : (
              <Link to={`/profile/${user._id}`}>
                <SvgIcon src="user" color="black" size={30} />
              </Link>
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
