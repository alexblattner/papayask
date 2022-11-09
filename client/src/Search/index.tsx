import React, { useContext, useState, useEffect } from "react";
import "./search.css";
const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [type, setType] = useState<number | null>(null);
  const [budget, setBudget] = useState<
    [
      string | number | readonly string[] | undefined,
      string | number | readonly string[] | undefined
    ]
  >([0, ""]);
  const [netWorth, setNetWorth] = useState<
    [
      string | number | readonly string[] | undefined,
      string | number | readonly string[] | undefined
    ]
  >([0, ""]);
  const [yearlyRevenue, setYearlyRevenue] = useState<
    [
      string | number | readonly string[] | undefined,
      string | number | readonly string[] | undefined
    ]
  >([0, ""]);
  const [experience, setExperience] = useState<
    [
      string | number | readonly string[] | undefined,
      string | number | readonly string[] | undefined
    ]
  >([0, ""]);
  const [geoExpertise, setGeoExpertise] = useState<
    string | number | readonly string[] | undefined
  >("");
  return (
    <div>
      <h1>Search</h1>
      <div id="top">
        <div id="search">
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setType(parseInt((e.target as HTMLSelectElement).value))
            }
          >
            <option disabled selected>
              Experience type
            </option>
            <option value="0">Any</option>
            <option value="1">Owner/Entrepeneurial</option>
            <option value="2">Freelance</option>
            <option value="3">Employment</option>
            <option value="4">Education</option>
          </select>
          <input type="text" placeholder="Search for experience" />
          <div>
            <span>Budget</span>
            <input
              type="text"
              value={budget[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setBudget([0, budget[1]]);
                } else {
                  setBudget([parseInt(value), budget[1]]);
                }
              }}
              placeholder="Min."
            />
            <input
              type="text"
              value={budget[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setBudget([budget[0], ""]);
                } else {
                  setBudget([budget[0], parseInt(value)]);
                }
              }}
              placeholder="Max."
            />
          </div>
          <div>
            {/*all */}
            <span>Net Worth($)</span>
            <input
              type="text"
              value={netWorth[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setNetWorth([0, netWorth[1]]);
                } else {
                  setNetWorth([parseInt(value), netWorth[1]]);
                }
              }}
              placeholder="Min."
            />
            <input
              type="text"
              value={netWorth[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setNetWorth([netWorth[0], ""]);
                } else {
                  setNetWorth([netWorth[0], parseInt(value)]);
                }
              }}
              placeholder="Max."
            />
          </div>
          <div>
            {/*all */}
            <span>Yearly Revenue($)</span>
            <input
              type="text"
              value={yearlyRevenue[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setYearlyRevenue([0, yearlyRevenue[1]]);
                } else {
                  setYearlyRevenue([parseInt(value), yearlyRevenue[1]]);
                }
              }}
              placeholder="Min."
            />
            <input
              type="text"
              value={yearlyRevenue[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setYearlyRevenue([0, yearlyRevenue[1]]);
                } else {
                  setYearlyRevenue([parseInt(value), yearlyRevenue[1]]);
                }
              }}
              placeholder="Max."
            />
          </div>
          <div>
            {/*all */}
            <span>Years of Experience</span>
            <input
              type="text"
              value={experience[0]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setExperience([0, experience[1]]);
                } else {
                  setExperience([parseInt(value), experience[1]]);
                }
              }}
              placeholder="Min."
            />
            <input
              type="text"
              value={experience[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = (e.target as HTMLInputElement).value;
                if (value == "") {
                  setExperience([0, experience[1]]);
                } else {
                  setExperience([parseInt(value), experience[1]]);
                }
              }}
              placeholder="Max."
            />
          </div>
          <div>
            {/*all */}
            <span>Geographic Specialization</span>
            <input
              type="text"
              value={geoExpertise}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGeoExpertise((e.target as HTMLInputElement).value)
              }
              placeholder="Country"
            />
          </div>
          {(type == 1 || type == 3) && (
            <div>
              {/*owner/employee */}
              <span>Institution</span>
              <input type="text" placeholder="Search for institution" />
              <input
                type="text"
                placeholder="Search for country of institution"
              />
              <div>
                <span>Yearly Revenue</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                <span>Net Worth</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                <span>Age of Institution</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                <span>Rating</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
            </div>
          )}
          {type == 2 && (
            <>
              <div>
                {/*freelance */}
                <span>Number of Projects</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                {/*freelance */}
                <span>Average Project Worth($)</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                {/*freelance */}
                <span>Average Rating</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                {/*freelance */}
                <span>Number of Ratings</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
              <div>
                {/*freelance */}
                <span>Top Buyer's Net Worth</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
            </>
          )}
          {type != null && (
            <>
              {/*all */}
              <input type="text" placeholder="Search for location" />
              {/*all */}
              <input type="text" placeholder="Search for language" />
              <div>
                {/*all */}
                <span>Amount of connections</span>
                <input type="text" placeholder="Min." />
                <input type="text" placeholder="Max." />
              </div>
            </>
          )}
          <button>Search</button>
        </div>
      </div>
      <div id="results"></div>
    </div>
  );
};

export default Search;
