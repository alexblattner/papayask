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

const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
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

const NavItem = styled(Link)`
  cursor: pointer;
  position: relative;
  color: black;
  text-decoration: none;
`;

const SpeakerIcon = styled('div')`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
`;

const SearchButton = styled('button')`
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

const SellerButton = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
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

      <SearchWrapper>
        <SearchButton onClick={(e) => handleSearch(e)}>
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
            <NavItem to="/questions">
              {user.newQuestionsCount > 0 && (
                <Badge>{user.newQuestionsCount}</Badge>
              )}
              {width > 1290 ? (
                <Text fontSize={18} fontWeight={'bold'}>
                  Questions
                </Text>
              ) : (
                <SvgIcon src="send" />
              )}
            </NavItem>
            <NavItem to="/notifications">
              {width > 1290 ? (
                <Text fontSize={18} fontWeight={'bold'}>
                  Notifications
                </Text>
              ) : (
                <SvgIcon src="bell" />
              )}
            </NavItem>
            <NavItem to="">
              {width > 1290 ? (
                <Text fontSize={18} fontWeight={'bold'}>
                  Favorites
                </Text>
              ) : (
                <SvgIcon src="heart" />
              )}
            </NavItem>
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
                    Giver
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
