import React, { useContext, useState, useEffect } from "react";
const Search = () => {
    return (
      <div>
        <h1>Search</h1>
        <div id="top">
            <div id="search">
                <select>
                    <option disabled>Experience type</option>
                    <option value="0">Any</option>
                    <option value="1">Owner/Entrepeneurial</option>
                    <option value="2">Freelance</option>
                    <option value="3">Employment</option>
                    <option value="4">Education</option>
                </select>
                <input type="text" placeholder="Search for experience"/>
                <div>
                    <span>Budget</span>
                    <input type="text" placeholder="Min."/>
                    <input type="text" placeholder="Max."/>
                </div>
                <div>
                    <span>Years of Experience</span>
                    <input type="text" placeholder="Min."/>
                    <input type="text" placeholder="Max."/>
                </div>
                <div>
                    <span>Geographic Specialization </span>
                    <input type="text" placeholder="Country"/>
                </div>
                <div>
                    <span>Institution</span>
                    <input type="text" placeholder="Search for institution"/>
                    <input type="text" placeholder="Search for country of institution"/>
                    <div>
                        <span>Yearly Revenue</span>
                        <input type="text" placeholder="Min."/>
                        <input type="text" placeholder="Max."/>
                    </div>
                    <div>
                        <span>Net Worth</span>
                        <input type="text" placeholder="Min."/>
                        <input type="text" placeholder="Max."/>
                    </div>
                    <div>
                        <span>Age of Institution</span>
                        <input type="text" placeholder="Min."/>
                        <input type="text" placeholder="Max."/>
                    </div>
                    <div>
                        <span>Rating</span>
                        <input type="text" placeholder="Min."/>
                        <input type="text" placeholder="Max."/>
                    </div>
                </div>
                <input type="text" placeholder="Search for location"/>
                <input type="text" placeholder="Search for language"/>
                <div>
                    <span>Amount of connections</span>
                    <input type="text" placeholder="Min."/>
                    <input type="text" placeholder="Max."/>
                </div>
                <button>Search</button>
            </div>
        </div>
        <div id="results"></div>
      </div>
    );
};

export default Search;