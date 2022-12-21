import React, { useContext, useState, useEffect, useRef } from "react";
import { MutableRefObject } from "react";
import api from "../utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase-auth";
import { Modal } from "react-bootstrap";
import styled from "styled-components";

import { AuthContext } from "../Auth/ContextProvider";
import SignUp from "../Auth/SignUp";
import LogIn from "../Auth/LogIn";
import ProfileSetup from "../profile/ProfileSetup";
import useWidth from "../Hooks/useWidth";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

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

function Header() {
  const { user } = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showLogIn, setShowLogIn] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showProfileSetup, setShowProfileSetup] =
    React.useState<boolean>(false);
  const logout = () => {
    auth.signOut();
  };
  const resultsRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Array<string>>([]);
  const navigate = useNavigate();

  function handleSearch(
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    navigate(`/search/${searchValue}`);
    searchEvent(searchValue);
    // navigate(`/search/${searchValue}`);
  }

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

  // const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  // };
  const { width } = useWidth();

  return (
    <>
      {!(
        window.location.href.includes("/sign-up") ||
        window.location.href.includes("/log-in")
      ) && (
        <>
          {showProfileSetup && (
            <ProfileSetup
              setShowProfileSetup={setShowProfileSetup}
              type={"initial"}
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
