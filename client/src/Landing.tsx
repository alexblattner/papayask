import React, { useContext, useState, useEffect, useRef } from "react";
import { MutableRefObject } from "react";
import api from "./utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";
const Landing = () => {
  const resultsRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Array<string>>([]);
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
  }, [searchValue]);

  return (
    <div id="landing">
      <div className="block">
        <div className="left">
          <h1>Get answers from leading experts</h1>
          {/* <ReactSearchAutocomplete /> */}

          <form onSubmit={handleSubmit} id="search-form">
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
        </div>
        <div className="right"></div>
      </div>
      <div className="block">
        <div className="left"></div>
        <div className="right"></div>
      </div>
    </div>
  );
};

export default Landing;
