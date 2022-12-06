import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { AuthContext } from '../Auth/ContextProvider';
import { ReactComponent as Logo } from '../logo.svg';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import SvgIcon from '../shared/SvgIcon';
import { Text } from '../shared/Text';

const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 90%;
  left: 5%;
  padding: 20px 0px;
`;

const SellerButton = styled('div')`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 4px 2px 4px 8px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
`;

interface Props {
  setShowProfileSetup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeader = (props: Props) => {
  const { setShowProfileSetup, setShowLogIn, setShowSignUp, setShowDrawer } =
    props;
  const { user } = React.useContext(AuthContext);
  return (
    <HeaderContainer>
      <Link to="/">
        <Logo height={40} />
      </Link>

      {user ? (
        <Container flex align="center" ml={'auto'} gap={12}>
          {user.isSetUp ? (
            <StyledLink to={`/profile/${user._id}`}>
              <SellerButton>
                <Text fontSize={18} fontWeight="bold" color="white">
                  Giver
                </Text>
                <SvgIcon src="user" color="white" />
              </SellerButton>
            </StyledLink>
          ) : (
            <Button variant="outline" onClick={() => setShowProfileSetup(true)}>
              BECOME A GIVER
            </Button>
          )}
          <Container onClick={() => setShowDrawer(true)}>
            <SvgIcon src="plus" />
          </Container>
        </Container>
      ) : (
        <Container flex align="center" gap={16} ml="auto">
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

export default MobileHeader;
