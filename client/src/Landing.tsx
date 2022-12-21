import React, { useContext, useState, useEffect } from "react";
import api from "./utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";
const Landing = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchOptions, setSearchOptions] = useState<Array<string>>([]);
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search/${searchValue}`);
  }

  const getSearchAutoSuggestion = async (text: string) => {
    const res = await api.get("/searchauto/", {
      params: {
        search: text,
      },
    });
    console.log(34512, res.data);
    setSearchOptions(res.data);
  };

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
        <div>
          {searchOptions.map((op: string) => (
            <div style={{ color: "navy", fontSize: "18px" }}>{op}</div>
          ))}
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
