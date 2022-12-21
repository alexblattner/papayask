import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FormControl, Form } from "react-bootstrap";
import { auth } from "../firebase-auth";
import { ReactComponent as FullLogo } from "../full_logo.svg";
import SvgIcon from "../shared/SvgIcon";
import { AuthContext } from "../Auth/ContextProvider";
import { Container } from "../shared/Container";
import { Text } from "../shared/Text";
import { Button } from "../shared/Button";
import useWidth from "../Hooks/useWidth";
import api from "../utils/api";

import { useSearchParams, useNavigate } from "react-router-dom";
import "./Header.css";
const HeaderContainer = styled.div`
  position: fixed;
  display: flex;
  gap: 16px;
  width: 90%;
  left: 5%;
  padding: 20px 0px;
`;

const SellerButton = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary);
  border-radius: 8px;
  padding: 4px 8px;
`;

const StyledLink = styled("div")`
  color: white;
  text-decoration: none;
  font-weight: bold;
`;

interface Props {
  handleSearch: (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => void;
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
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const signout = () => {
    auth.signOut();
  };

  const resultsRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Array<string>>([]);
  const navigate = useNavigate();

  // function handleSearch(
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) {
  //   event.preventDefault();
  //   navigate(`/search/${searchValue}`);
  //   searchEvent(searchValue);
  //   // navigate(`/search/${searchValue}`);
  // }

  const searchEvent = (searchWord: string): void => {
    navigate(`/search/${searchWord}`);
  };

  const getSearchAutoSuggestion = async (text: string) => {
    const res = await api.get("/searchauto/", {
      params: {
        search: text,
      },
    });
    console.log(34512, res.data);
    setSearchOptions(res.data);
  };

  const onKeyDown = (event: any) => {
    // console.log(656565, event);

    const isUp = event.key === "ArrowUp";
    const isDown = event.key === "ArrowDown";
    const isEnterKey = event.key === "Enter";
    const inputIsFocused = document.activeElement === inputRef.current;
    const resultsItems = resultsRef.current
      ? Array.from(resultsRef.current.children)
      : [];
    const activeIndex = resultsItems.findIndex(
      (child) => child.querySelector("span") === document.activeElement
    );
    if (
      activeIndex !== -1 &&
      resultsItems[activeIndex].querySelector("span") ===
        document.activeElement &&
      isEnterKey
    ) {
      const searchText =
        resultsItems[activeIndex].querySelector("span")!.innerText;
      searchEvent(searchText);
    }
    if (isDown) {
      if (inputIsFocused) {
        event.preventDefault();
        resultsItems[0].querySelector("span")!.focus();
      } else if (
        resultsItems[activeIndex + 1] &&
        resultsItems[activeIndex].querySelector("span") ===
          document.activeElement
      ) {
        event.preventDefault();
        resultsItems[activeIndex + 1].querySelector("span")?.focus();
      } else if (
        resultsItems[resultsItems.length - 1].querySelector("span") ===
        document.activeElement
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      } else {
        event.returnValue = true;
      }
    }
    if (isUp) {
      if (inputIsFocused) {
        event.preventDefault();
        resultsItems[resultsItems.length - 1].querySelector("span")?.focus();
      } else if (
        resultsItems[activeIndex - 1] &&
        resultsItems[activeIndex].querySelector("span") ===
          document.activeElement
      ) {
        event.preventDefault();
        let nextIndex = activeIndex - 1;
        resultsItems[nextIndex].querySelector("span")?.focus();
      } else if (
        resultsItems[0].querySelector("span") === document.activeElement
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      } else {
        event.returnValue = true;
      }
    }
  };

  useEffect(() => {
    if (searchOptions.length > 0) {
      document.body.addEventListener("keydown", onKeyDown);
    } else {
      document.body.removeEventListener("keydown", onKeyDown);
    }
    return () => {
      document.body.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOptions]);

  useEffect(() => {
    if (searchValue != "") {
      getSearchAutoSuggestion(searchValue);
    }

    // return () => getSearchAutoSuggestion();
  }, [searchValue]);

  return (
    <HeaderContainer>
      <Link to="/">
        <FullLogo width={150} height={50} />
      </Link>
      <form onSubmit={handleSearch} id="search-form">
        <input
          ref={inputRef}
          type="text"
          placeholder='Try "SEO", "Entrepreneurship" or "Hosting'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
        />
        <input type="submit" value="Search" />
      </form>
      <div ref={resultsRef}>
        {searchOptions.map((op: string) => (
          <div
            onClick={() => {
              searchEvent(op);
            }}
            style={{ color: "navy", fontSize: "18px" }}
          >
            <span tabIndex={0} className="focus-search">
              {op}
            </span>
          </div>
        ))}
      </div>

      {user ? (
        <>
          <Container flex align="center" gap={16} ml="auto">
            {}
            {!user.isSetUp && (
              <Button
                variant="outline"
                onClick={() => setShowProfileSetup(true)}
              >
                BECOME AN ADVISOR
              </Button>
            )}
            {user.isSetUp ? (
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
