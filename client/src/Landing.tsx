import React, { useContext, useState, useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
const Landing = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search/${searchValue}`);
  }

  return (
    <div id="landing">
      <div className="block">
        <div className="left">
          <h1>Get answers from leading experts</h1>
          <form onSubmit={handleSubmit} id="search-form">
            <input
              type="text"
              placeholder='Try "SEO", "Entrepreneurship" or "Hosting'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.target.value)
              }
            />
            <input type="submit" value="Search" />
          </form>
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
